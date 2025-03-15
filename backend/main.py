
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from bson.objectid import ObjectId
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
import auth
import json
from models import UserCreate, UserLogin
from fastapi.encoders import jsonable_encoder
import score_calculator

# Cargar variables de entorno
load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:8080"
]

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # URL de tu frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectar a MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["pyme360"] # Base de datos
test_collection = db["test"]  # Colección para pruebas
user_collection = db["users"]  # Colección para usuarios

# Modelo para la solicitud de prueba
class TestRequest(BaseModel):
    testValue: str

# Ruta de prueba
@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}

# Función para serializar documentos de MongoDB
def serialize_mongo_document(doc):
    """Convierte un documento de MongoDB en un diccionario serializable."""
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    return doc

# Endpoint para probar la conexión
@app.post("/api/test-connection")
def test_mongo_connection(request: TestRequest):
    try:
        print(f"Probando conexión a MongoDB con valor: {request.testValue}")
        # Insertar el valor en la colección de prueba
        test_data = {
            "test_value": request.testValue,
            "timestamp": datetime.now().isoformat()
        }
        result = test_collection.insert_one(test_data)
        print(f"Documento insertado con ID: {result.inserted_id}")
        
        # Devolver respuesta con el ID del documento insertado
        return {
            "message": "Conexión exitosa",
            "inserted_id": str(result.inserted_id),
            "test_value": request.testValue
        }
    except Exception as e:
        print(f"Error al conectar con MongoDB: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al conectar con MongoDB: {str(e)}")

# Endpoints de autenticación
@app.post("/api/auth/register")
async def register(user_data: UserCreate):
    try:
        # Verificar si el usuario ya existe
        existing_user = user_collection.find_one({"username": user_data.username})
        if existing_user:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
        
        # Hashear la contraseña
        hashed_password = auth.get_password_hash(user_data.password)
        
        # Preparar el modelo de usuario para guardar
        user_dict = user_data.model_dump()
        user_dict["password"] = hashed_password
        
        # Insertar el usuario en la base de datos
        result = user_collection.insert_one(user_dict)
        
        return {"message": "Usuario registrado correctamente", "user_id": str(result.inserted_id)}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error en el registro: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en el registro: {str(e)}")

@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        print(f"Intento de login: {form_data.username}")
        user = auth.authenticate_user(form_data.username, form_data.password)
        if not user:
            print(f"Autenticación fallida para {form_data.username}")
            raise HTTPException(
                status_code=401,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Generar token JWT
        access_token = auth.create_access_token(
            data={"sub": user["username"]}
        )
        
        print(f"Login exitoso para {form_data.username}")
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as he:
        print(f"Error HTTP en login: {he.detail}")
        raise he
    except Exception as e:
        print(f"Error desconocido en login: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error de autenticación: {str(e)}")

@app.get("/api/auth/me")
async def get_current_user(current_user: dict = Depends(auth.get_current_user)):
    # Eliminar la contraseña del objeto de usuario
    if "password" in current_user:
        current_user.pop("password")
    
    # Convertir ObjectId a string
    current_user_serializable = serialize_mongo_document(current_user)
    return jsonable_encoder(current_user_serializable)

# Nuevos endpoints para la puntuación crediticia
@app.get("/api/credit-score")
async def get_credit_score(current_user: dict = Depends(auth.get_current_user)):
    try:
        # Calcular puntuación crediticia
        credit_score = score_calculator.calculate_credit_score(current_user)
        return credit_score
    except Exception as e:
        print(f"Error al calcular puntuación crediticia: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al calcular puntuación crediticia: {str(e)}")

# Endpoint para obtener deudas activas del usuario
@app.get("/api/active-debts")
async def get_active_debts(current_user: dict = Depends(auth.get_current_user)):
    try:
        historial_crediticio = current_user.get("historial_crediticio", {})
        
        # Obtener cuentas de crédito y proveedores
        cuentas_credito = historial_crediticio.get("cuentas_credito", [])
        credito_proveedores = historial_crediticio.get("credito_proveedores", [])
        
        deudas = []
        
        # Procesar cuentas de crédito
        for cuenta in cuentas_credito:
            if cuenta.get("saldo_actual", 0) > 0:
                deuda = {
                    "tipo": cuenta.get("tipo_credito", "Crédito"),
                    "entidad": cuenta.get("entidad", "Entidad Financiera"),
                    "monto": cuenta.get("saldo_actual", 0),
                    "interes": f"{cuenta.get('tasa_interes', 0)}%",
                    "fecha": cuenta.get("fecha_proximo_pago", ""),
                    "estatus": "Al día" if not cuenta.get("pagos_tardios", []) else "Con retraso"
                }
                deudas.append(deuda)
        
        # Procesar créditos de proveedores
        for proveedor in credito_proveedores:
            if proveedor.get("saldo_actual", 0) > 0:
                deuda = {
                    "tipo": "Crédito Comercial",
                    "entidad": proveedor.get("nombre_proveedor", "Proveedor"),
                    "monto": proveedor.get("saldo_actual", 0),
                    "interes": f"{proveedor.get('tasa_interes', 0)}%",
                    "fecha": proveedor.get("fecha_proximo_pago", ""),
                    "estatus": "Al día" if not proveedor.get("pagos_tardios", []) else "Con retraso"
                }
                deudas.append(deuda)
        
        # Si no hay deudas reales, generar datos simulados
        if not deudas:
            deudas = [
                {
                    "tipo": "Tarjeta de Crédito",
                    "entidad": "Banco Nacional",
                    "monto": 4500,
                    "interes": "24.9%",
                    "fecha": "15/07/2024",
                    "estatus": "Al día"
                },
                {
                    "tipo": "Préstamo Personal",
                    "entidad": "Financiera Central",
                    "monto": 12000,
                    "interes": "16.5%",
                    "fecha": "28/07/2024",
                    "estatus": "Al día"
                },
                {
                    "tipo": "Crédito Automotriz",
                    "entidad": "Auto Finance",
                    "monto": 35000,
                    "interes": "11.2%",
                    "fecha": "10/07/2024",
                    "estatus": "Con retraso"
                }
            ]
        
        return {"deudas": deudas}
    except Exception as e:
        print(f"Error al obtener deudas activas: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener deudas activas: {str(e)}")

# Endpoint para obtener el PyME360 Trust Score
@app.get("/api/trust-score")
async def get_trust_score(current_user: dict = Depends(auth.get_current_user)):
    try:
        # Calcular PyME360 Trust Score
        trust_score = score_calculator.calculate_trust_score(current_user)
        return trust_score
    except Exception as e:
        print(f"Error al calcular PyME360 Trust Score: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al calcular PyME360 Trust Score: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
