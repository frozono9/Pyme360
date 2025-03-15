
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
from score_calculator import calculate_credit_score, calculate_pyme360_trust_score

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
        print(f"Intento de registro para usuario: {user_data.username}")
        # Verificar si el usuario ya existe
        existing_user = user_collection.find_one({"username": user_data.username})
        if existing_user:
            print(f"Usuario {user_data.username} ya existe")
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
        
        # Hashear la contraseña
        hashed_password = auth.get_password_hash(user_data.password)
        
        # Preparar el modelo de usuario para guardar
        user_dict = user_data.model_dump()
        user_dict["password"] = hashed_password
        
        # Eliminar la contraseña de información general si existe
        if "informacion_general" in user_dict and "contrasena" in user_dict["informacion_general"]:
            del user_dict["informacion_general"]["contrasena"]
        
        # Calcular el credit score y el pyme360 trust score
        credit_score = calculate_credit_score(user_dict)
        pyme360_trust_score = calculate_pyme360_trust_score(user_dict)
        
        # Agregar los scores calculados
        if "error" not in credit_score:
            user_dict["credit_score"] = credit_score
        if "error" not in pyme360_trust_score:
            user_dict["pyme360_trust_score"] = pyme360_trust_score
        
        # Insertar el usuario en la base de datos
        result = user_collection.insert_one(user_dict)
        print(f"Usuario {user_data.username} registrado con ID: {result.inserted_id}")
        
        return {"message": "Usuario registrado correctamente", "user_id": str(result.inserted_id)}
    except HTTPException as he:
        print(f"Error HTTP en registro: {he.detail}")
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

# Nuevos endpoints para obtener scores
@app.get("/api/scores/credit")
async def get_credit_score(current_user: dict = Depends(auth.get_current_user)):
    try:
        # Si ya existe un credit score calculado, devolverlo
        if "credit_score" in current_user:
            return current_user["credit_score"]
        
        # Si no existe, calcularlo
        credit_score = calculate_credit_score(current_user)
        
        # Actualizar en la base de datos
        user_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"credit_score": credit_score}}
        )
        
        return credit_score
    except Exception as e:
        print(f"Error al obtener credit score: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener credit score: {str(e)}")

@app.get("/api/scores/trust")
async def get_trust_score(current_user: dict = Depends(auth.get_current_user)):
    try:
        # Si ya existe un trust score calculado, devolverlo
        if "pyme360_trust_score" in current_user:
            return current_user["pyme360_trust_score"]
        
        # Si no existe, calcularlo
        trust_score = calculate_pyme360_trust_score(current_user)
        
        # Actualizar en la base de datos
        user_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"pyme360_trust_score": trust_score}}
        )
        
        return trust_score
    except Exception as e:
        print(f"Error al obtener trust score: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener trust score: {str(e)}")

# Endpoint para recalcular y actualizar scores
@app.post("/api/scores/update")
async def update_scores(current_user: dict = Depends(auth.get_current_user)):
    try:
        # Recalcular ambos scores
        credit_score = calculate_credit_score(current_user)
        trust_score = calculate_pyme360_trust_score(current_user)
        
        # Actualizar en la base de datos
        user_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {
                "credit_score": credit_score,
                "pyme360_trust_score": trust_score
            }}
        )
        
        return {
            "message": "Scores actualizados correctamente",
            "credit_score": credit_score,
            "trust_score": trust_score
        }
    except Exception as e:
        print(f"Error al actualizar scores: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al actualizar scores: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
