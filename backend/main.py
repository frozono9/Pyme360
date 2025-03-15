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

# Endpoint para probar la conexión
@app.post("/api/test-connection")
def test_mongo_connection(request: TestRequest):
    try:
        # Insertar el valor en la colección de prueba
        test_data = {
            "test_value": request.testValue,
        }
        result = test_collection.insert_one(test_data)
        
        # Devolver respuesta con el ID del documento insertado
        return {
            "message": "Conexión exitosa",
            "inserted_id": str(result.inserted_id),
            "test_value": request.testValue
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al conectar con MongoDB: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
