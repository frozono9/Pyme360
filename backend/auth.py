
import os
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Header, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pymongo import MongoClient
from dotenv import load_dotenv
from models import UserCreate, UserLogin

# Cargar variables de entorno
load_dotenv()

# Configuración de seguridad
# Usar un esquema más compatible con la versión de bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Conectar a MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["pyme360"]
users_collection = db["users"]  # Colección de usuarios

# Clave secreta para JWT
SECRET_KEY = os.getenv("SECRET_KEY", "UN_SECRETO_MUY_SEGURO")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Error verificando contraseña: {e}")
        return False

def get_password_hash(password):
    try:
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Error hasheando contraseña: {e}")
        raise e

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_username(username: str):
    user = users_collection.find_one({"username": username})
    print(f"Usuario encontrado: {user is not None}")
    return user

def authenticate_user(username: str, password: str):
    user = get_user_by_username(username)
    if not user:
        print(f"Usuario {username} no encontrado")
        return False
    if not verify_password(password, user["password"]):
        print(f"Contraseña incorrecta para {username}")
        return False
    print(f"Autenticación exitosa para {username}")
    return user

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token de autenticación inválido")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token de autenticación inválido")
    
    user = get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    return user
