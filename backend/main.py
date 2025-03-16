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
import random

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

# Modelo para la solicitud de predicción de KPI
class KpiPredictionRequest(BaseModel):
    kpi_type: str
    period: str
    include_seasonality: bool = False
    include_market_factors: bool = False
    show_confidence_interval: bool = True

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
        
        # Asegurarse de que la información general tenga el país
        if "informacion_general" in user_dict and "pais" not in user_dict["informacion_general"]:
            user_dict["informacion_general"]["pais"] = user_data.informacion_general.pais
        
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

# Nuevo endpoint para consultar al asistente IA de financiamiento
@app.post("/api/financing-assistant")
async def query_financing_assistant(
    question: dict,
    current_user: dict = Depends(auth.get_current_user)
):
    try:
        from agents.asistenteaifin import query
        
        # Obtener datos del usuario de MongoDB para pasarlos al asistente
        user_data = json.dumps(serialize_mongo_document(current_user))
        
        # Enviar la consulta al asistente IA
        response = query(user_data, question.get("question", ""))
        
        # Extraer solo el texto de la respuesta
        response_text = response.get("text", "")
        
        return {"response": response_text}
    except Exception as e:
        print(f"Error al consultar al asistente IA: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al consultar al asistente IA: {str(e)}")

# Nuevo endpoint para consultar al asistente IA general
@app.post("/api/general-assistant")
async def query_general_assistant(
    question: dict,
    current_user: dict = Depends(auth.get_current_user)
):
    try:
        from agents.agentegeneral import query
        
        # Obtener datos del usuario de MongoDB para pasarlos al asistente
        user_data = json.dumps(serialize_mongo_document(current_user))
        
        # Cargar información de la web
        with open('agents/web_database.txt', 'r', encoding='utf-8') as file:
            info_web = file.read()
        
        # Enviar la consulta al asistente IA
        response = query(question.get("question", ""), info_web, user_data)
        
        # Extraer solo el texto de la respuesta
        if isinstance(response, dict) and "text" in response:
            response_text = response.get("text", "")
        else:
            response_text = str(response)
        
        return {"response": response_text}
    except Exception as e:
        print(f"Error al consultar al asistente IA general: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al consultar al asistente IA general: {str(e)}")

# Nuevo endpoint para predicciones de KPIs
@app.post("/api/kpi-prediction")
async def predict_kpi(
    request: KpiPredictionRequest,
    current_user: dict = Depends(auth.get_current_user)
):
    try:
        print(f"Generando predicción para KPI: {request.kpi_type}")
        
        # Obtener información del usuario
        info_general = current_user.get("informacion_general", {})
        sector = info_general.get("sector", "Tecnología")
        pais = info_general.get("pais", "México")
        
        # Variables financieras
        finanzas = current_user.get("finanzas", {})
        ingresos_base = finanzas.get("ingresos_anuales", random.randint(8000, 15000))
        
        # Período en meses
        periodo_meses = 12
        if request.period == "12m":
            periodo_meses = 12
        elif request.period == "24m":
            periodo_meses = 24
        elif request.period == "36m":
            periodo_meses = 36
        
        # Calcular tasa de crecimiento basada en el sector
        tasas_crecimiento = {
            "Tecnología": random.uniform(0.08, 0.15),
            "Retail": random.uniform(0.05, 0.12),
            "Servicios": random.uniform(0.06, 0.10),
            "Manufactura": random.uniform(0.04, 0.09),
            "Construcción": random.uniform(0.03, 0.08),
            "Salud": random.uniform(0.07, 0.14),
        }
        tasa_mensual = tasas_crecimiento.get(sector, random.uniform(0.05, 0.10)) / 12
        
        # Ajustar por país
        multiplicadores_pais = {
            "México": 1.0,
            "Colombia": 1.1,
            "Chile": 1.2,
            "Perú": 0.9,
            "Argentina": 0.85,
            "España": 1.15
        }
        tasa_mensual *= multiplicadores_pais.get(pais, 1.0)
        
        # Generar datos mensuales
        valores_mensuales = []
        valor_actual = ingresos_base
        
        for i in range(periodo_meses + 1):  # +1 para incluir el valor inicial
            # Añadir factores de estacionalidad si se solicita
            factor_estacional = 1.0
            if request.include_seasonality:
                # Estacionalidad basada en el mes (suponiendo que empezamos en enero)
                mes_actual = (i % 12) + 1
                if mes_actual in [11, 12]:  # Noviembre y diciembre
                    factor_estacional = 1.2  # Temporada alta
                elif mes_actual in [1, 2]:  # Enero y febrero
                    factor_estacional = 0.8  # Temporada baja
            
            # Añadir factores de mercado aleatorios si se solicita
            factor_mercado = 1.0
            if request.include_market_factors and random.random() < 0.3:  # 30% de probabilidad de evento de mercado
                factor_mercado = random.uniform(0.9, 1.1)
            
            # Calcular valor con todos los factores
            if i > 0:  # Para el primer punto, usar el valor base
                crecimiento = (1 + tasa_mensual) * factor_estacional * factor_mercado
                volatilidad = random.uniform(0.97, 1.03)  # Añadir algo de ruido
                valor_actual = valor_actual * crecimiento * volatilidad
            
            # Añadir a la lista de valores mensuales
            valores_mensuales.append(round(valor_actual, 2))
        
        # Calcular valor final e incremento total
        valor_inicial = valores_mensuales[0]
        valor_final = valores_mensuales[-1]
        crecimiento_total = ((valor_final / valor_inicial) - 1) * 100
        crecimiento_mensual = ((1 + crecimiento_total/100) ** (1/periodo_meses) - 1) * 100
        
        # Identificar meses con eventos especiales
        eventos_mercado = []
        fechas_base = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"]
        años = [2024, 2025, 2026, 2027]
        
        # Generar entre 2 y 4 eventos
        num_eventos = random.randint(2, 4)
        eventos_posibles = [
            {"mes": "may", "año": 2025, "descripcion": "Temporada alta"},
            {"mes": "oct", "año": 2025, "descripcion": "Desaceleración del mercado"},
            {"mes": "ene", "año": 2026, "descripcion": "Impulso pre-festividades"},
            {"mes": "jul", "año": 2026, "descripcion": "Expansión del sector"},
            {"mes": "dic", "año": 2025, "descripcion": "Cierre fiscal favorable"},
            {"mes": "mar", "año": 2026, "descripcion": "Nuevas regulaciones"}
        ]
        
        eventos_seleccionados = random.sample(eventos_posibles, min(num_eventos, len(eventos_posibles)))
        for evento in eventos_seleccionados:
            eventos_mercado.append(evento)
        
        # Etiquetas para el eje X (meses)
        etiquetas_meses = []
        for i in range(periodo_meses + 1):
            mes_idx = i % 12
            año = años[i // 12]
            etiqueta = f"{fechas_base[mes_idx]} {año}"
            etiquetas_meses.append(etiqueta)
        
        # Crear intervalo de confianza (valores superior e inferior)
        if request.show_confidence_interval:
            valores_superior = [v * random.uniform(1.05, 1.15) for v in valores_mensuales]
            valores_inferior = [v * random.uniform(0.85, 0.95) for v in valores_mensuales]
        else:
            valores_superior = valores_mensuales
            valores_inferior = valores_mensuales
        
        # Determinar volatilidad
        volatilidad = round(random.uniform(6.5, 12.5), 2)
        
        # Determinar mes de mayor y menor crecimiento
        incrementos_mensuales = []
        for i in range(1, len(valores_mensuales)):
            incremento = ((valores_mensuales[i] / valores_mensuales[i-1]) - 1) * 100
            incrementos_mensuales.append({"mes": etiquetas_meses[i], "incremento": incremento})
        
        incrementos_mensuales.sort(key=lambda x: x["incremento"], reverse=True)
        mejor_mes = incrementos_mensuales[0]["mes"]
        mejor_incremento = round(incrementos_mensuales[0]["incremento"], 2)
        
        peor_mes = incrementos_mensuales[-1]["mes"]
        peor_incremento = round(incrementos_mensuales[-1]["incremento"], 2)
        
        # Crear recomendación basada en los resultados
        recomendacion = ""
        if crecimiento_total > 50:
            recomendacion = "Basado en tu proyección de ingresos, es recomendable preparar tu operación para escalar rápidamente. Considera invertir en capacidad adicional y optimizar procesos para mantener la calidad durante este fuerte crecimiento."
        elif crecimiento_total > 20:
            recomendacion = "Tu negocio muestra un crecimiento sólido. Recomendamos reforzar tus procesos operativos y comenzar a planificar la siguiente fase de expansión para aprovechar esta tendencia positiva."
        else:
            recomendacion = "Tu proyección muestra un crecimiento moderado. Enfócate en optimizar costos y mejorar márgenes, mientras exploras nuevas oportunidades de mercado para acelerar el crecimiento."
        
        # Añadir recomendación sobre volatilidad
        if volatilidad > 10:
            recomendacion += " La tendencia histórica volátil sugiere preparar planes de contingencia para diferentes escenarios. Mantén reservas operativas y financieras para adaptarte a cambios bruscos."
        else:
            recomendacion += " Tu negocio muestra una tendencia estable, lo que facilita la planificación a largo plazo. Aprovecha esta estabilidad para realizar inversiones estratégicas con mayor confianza."
        
        # Construir respuesta
        respuesta = {
            "kpi_type": request.kpi_type,
            "initial_value": valor_inicial,
            "final_value": valor_final,
            "monthly_values": valores_mensuales,
            "upper_limit": valores_superior,
            "lower_limit": valores_inferior,
            "total_growth_percentage": round(crecimiento_total, 2),
            "monthly_growth_percentage": round(crecimiento_mensual, 2),
            "volatility": volatilidad,
            "month_labels": etiquetas_meses,
            "market_events": eventos_mercado,
            "best_month": {
                "month": mejor_mes,
                "growth": mejor_incremento
            },
            "worst_month": {
                "month": peor_mes,
                "growth": peor_incremento
            },
            "factors": {
                "seasonality": request.include_seasonality,
                "market_factors": request.include_market_factors,
                "country": pais,
                "sector": sector
            },
            "recommendation": recomendacion,
            "confidence": "moderada"
        }
        
        return respuesta
    except Exception as e:
        print(f"Error al generar predicción de KPI: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al generar predicción de KPI: {str(e)}")

# Nuevo endpoint para consultar al asistente de documentación
@app.post("/api/documentation-assistant")
async def query_documentation_assistant(
    question: dict,
    current_user: dict = Depends(auth.get_current_user)
):
    try:
        from agents.agentedocumentacion import query
        
        # Obtener datos del usuario de MongoDB para pasarlos al asistente
        user_data = json.dumps(serialize_mongo_document(current_user))
        
        # Enviar la consulta al asistente IA
        response = query(question.get("question", ""))
        
        # Extraer solo el texto de la respuesta
        if isinstance(response, dict) and "text" in response:
            response_text = response.get("text", "")
        else:
            response_text = str(response)
        
        return {"response": response_text}
    except Exception as e:
        print(f"Error al consultar al asistente de documentación: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al consultar al asistente de documentación: {str(e)}")

# Nuevo endpoint para consultar al asistente de tendencias de mercado
@app.post("/api/market-trends")
async def query_market_trends(
    question: dict,
    current_user: dict = Depends(auth.get_current_user)
):
    try:
        from agents.tendencias import query
        
        # Obtener datos del usuario de MongoDB para extraer el sector
        info_general = current_user.get("informacion_general", {})
        sector = info_general.get("sector", "Tecnología")

        # Enviar la consulta al asistente de tendencias
        response = query(question.get("question", ""), sector, info_general.get("pais", "Latam"))
        
        return response
    except Exception as e:
        print(f"Error al consultar tendencias de mercado: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al consultar tendencias de mercado: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
