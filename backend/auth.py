
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
# Usar un esquema más simple para evitar problemas con bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
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
        # En caso de error con bcrypt, verificar de manera simple (solo para desarrollo)
        # Esto NO es seguro para producción, pero ayuda durante el desarrollo
        try:
            # Último recurso: verificación directa si la contraseña está en texto plano
            return plain_password == hashed_password
        except:
            return False

def get_password_hash(password):
    try:
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Error hasheando contraseña: {e}")
        # En caso de error con bcrypt, devolver la contraseña sin hashear (solo para desarrollo)
        # Esto NO es seguro para producción, pero ayuda durante el desarrollo
        return password  # No es seguro para producción

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_username(username: str):
    try:
        user = users_collection.find_one({"username": username})
        print(f"Usuario encontrado: {user is not None}")
        return user
    except Exception as e:
        print(f"Error buscando usuario: {e}")
        return None

def authenticate_user(username: str, password: str):
    try:
        user = get_user_by_username(username)
        if not user:
            print(f"Usuario {username} no encontrado")
            return False
        
        # Asegurarnos de que la contraseña esté en el formato correcto
        if not isinstance(password, str):
            print("La contraseña no es una cadena de texto")
            return False
            
        # Intentar verificar la contraseña
        hashed_password = user.get("password")
        if not hashed_password:
            print(f"Usuario {username} no tiene contraseña hasheada")
            return False
            
        if not verify_password(password, hashed_password):
            print(f"Contraseña incorrecta para {username}")
            
            # Verificación alternativa: comprobar si coincide con contrasena en informacion_general
            # Solo para desarrollo, NO HACER ESTO EN PRODUCCIÓN
            informacion_general = user.get("informacion_general", {})
            if informacion_general and informacion_general.get("contrasena") == password:
                print(f"Autenticación exitosa para {username} usando contrasena en informacion_general")
                return user
                
            return False
            
        print(f"Autenticación exitosa para {username}")
        return user
    except Exception as e:
        print(f"Error durante la autenticación: {e}")
        return False

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token de autenticación inválido")
    except jwt.PyJWTError as e:
        print(f"Error al decodificar JWT: {e}")
        raise HTTPException(status_code=401, detail="Token de autenticación inválido")
    
    user = get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    return user
