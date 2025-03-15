from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from pymongo.collection import Collection
from pymongo.database import Database
from bson import ObjectId
import os, json
from dotenv import load_dotenv
from models import *
import datetime

load_dotenv()
MAX_MESSAGES = 25

class MongoDBClient:
    def __init__(self, db_name="pyme360"):
        """
        Initializes the MongoDB client with authentication.
        
        :param db_name: Database name
        """
        self.uri = os.getenv("MONGO_URI")
        self.db_name = db_name
        self.client = None
        self.db = None
        self.connect()
        self.users_collection = self.db["users"]  # Cambiado de usuarios a users
    
    def connect(self):
        """Establishes the connection with MongoDB."""
        try:
            self.client = MongoClient(self.uri)
            self.db = self.client[self.db_name]
            self.client.admin.command("ping")
            print(f"Connected to MongoDB: {self.db_name}")
        except ConnectionFailure as e:
            print(f"Connection error: {e}")
    
    def get_collection(self, collection_name: str) -> Collection:
        return self.db[collection_name]
    
    def insert_one(self, collection_name: str, document: dict) -> str:
        collection = self.get_collection(collection_name)
        result = collection.insert_one(document)
        return str(result.inserted_id)
    
    def find_one(self, collection_name: str, query: dict) -> dict:
        collection = self.get_collection(collection_name)
        return collection.find_one(query)
    
    def find_many(self, collection_name: str, query: dict) -> list:
        collection = self.get_collection(collection_name)
        return list(collection.find(query))
    
    def update_one(self, collection_name: str, query: dict, update: dict) -> int:
        collection = self.get_collection(collection_name)
        result = collection.update_one(query, {'$set': update})
        return result.modified_count
    
    def delete_one(self, collection_name: str, query: dict) -> int:
        collection = self.get_collection(collection_name)
        result = collection.delete_one(query)
        return result.deleted_count
    
    # Métodos adaptados para la colección users
    def get_user(self, username: str):
        """Recupera el usuario basado en su nombre de usuario.
        Si no existe devuelve None."""
        try:
            return self.users_collection.find_one({"username": username}, {"_id": 0})  # Exclude MongoDB _id field
        except Exception as e:
            print(f"MongoDB Error: {e}")
            return None
    
    def get_user_by_id(self, user_id: str):
        """Recupera el usuario basado en su ID.
        Si no existe devuelve None."""
        try:
            return self.users_collection.find_one({"_id": ObjectId(user_id)}, {"_id": 0})
        except Exception as e:
            print(f"MongoDB Error: {e}")
            return None
    
    def get_dict_usuario(self, username: str):
        """
        Recupera los datos del usuario desde MongoDB y los convierte en un diccionario sin modificaciones.

        Parámetros:
        - username (str): Nombre de usuario en MongoDB.

        Retorna:
        - dict: Diccionario con la información del usuario o None si no se encuentra.
        """
        usuario_data = self.get_user(username)
        if not usuario_data:
            return None  # Si no se encuentra el usuario, retorna None

        return json.loads(json.dumps(usuario_data))  # Asegura que sea un dict estándar
    
    def insertar_usuario_inicial(self, user_data: UserCreate) -> bool:
        existing_user = self.users_collection.find_one({"username": user_data.username})
        if existing_user:
            print(f"Usuario '{user_data.username}' ya existe.")
            return False
        user_data = user_data.model_dump()
        result = self.users_collection.insert_one(user_data)
        return True
    
    # Métodos nuevos para manejar los datos de caso1.json
    def get_empresa_data(self, username: str):
        """Recupera los datos de la empresa del usuario."""
        user = self.get_user(username)
        if not user or "empresa_data" not in user:
            return None
        return user["empresa_data"]
    
    def update_empresa_data(self, username: str, empresa_data: dict) -> bool:
        """Actualiza los datos de la empresa del usuario."""
        try:
            result = self.users_collection.update_one(
                {"username": username},
                {"$set": {"empresa_data": empresa_data}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error actualizando datos de empresa: {e}")
            return False
    
    def get_historial_crediticio(self, username: str):
        """Recupera el historial crediticio de la empresa del usuario."""
        empresa_data = self.get_empresa_data(username)
        if not empresa_data or "historial_crediticio" not in empresa_data:
            return None
        return empresa_data["historial_crediticio"]
    
    def get_ventas_mensuales(self, username: str):
        """Recupera las ventas mensuales de la empresa del usuario."""
        empresa_data = self.get_empresa_data(username)
        if not empresa_data or "ventas_mensuales" not in empresa_data:
            return None
        return empresa_data["ventas_mensuales"]
    
    def get_pyme360_trust_score(self, username: str):
        """Recupera el pyme360_trust_score de la empresa del usuario."""
        empresa_data = self.get_empresa_data(username)
        if not empresa_data or "pyme360_trust_score" not in empresa_data:
            return None
        return empresa_data["pyme360_trust_score"]