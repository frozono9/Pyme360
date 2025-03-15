
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
        print(f"Verificando contraseña: {plain_password[:2]}*** contra hash: {hashed_password[:10]}...")
        # Asegurarnos de que la contraseña esté en formato str
        if not isinstance(plain_password, str):
            plain_password = str(plain_password)
        
        result = pwd_context.verify(plain_password, hashed_password)
        print(f"Resultado de verificación: {result}")
        return result
    except Exception as e:
        print(f"Error verificando contraseña: {str(e)}")
        # Intentar manejar el error específico de bcrypt
        if "error reading bcrypt version" in str(e):
            print("Detectado error de bcrypt. Intentando método alternativo...")
            try:
                # Verificación directa (menos segura pero usada como fallback)
                import bcrypt
                hashed_bytes = hashed_password.encode('utf-8') if isinstance(hashed_password, str) else hashed_password
                password_bytes = plain_password.encode('utf-8') if isinstance(plain_password, str) else plain_password
                return bcrypt.checkpw(password_bytes, hashed_bytes)
            except Exception as e2:
                print(f"Error en método alternativo: {str(e2)}")
                return False
        return False

def get_password_hash(password):
    try:
        # Asegurarnos de que la contraseña esté en formato str
        if not isinstance(password, str):
            password = str(password)
        
        hashed = pwd_context.hash(password)
        print(f"Contraseña hasheada con éxito: {hashed[:10]}...")
        return hashed
    except Exception as e:
        print(f"Error hasheando contraseña: {str(e)}")
        # Intentar método alternativo si falla el método principal
        try:
            import bcrypt
            # Generación de sal y hash directamente
            salt = bcrypt.gensalt()
            password_bytes = password.encode('utf-8') if isinstance(password, str) else password
            hashed = bcrypt.hashpw(password_bytes, salt)
            return hashed.decode('utf-8') if isinstance(hashed, bytes) else hashed
        except Exception as e2:
            print(f"Error en método alternativo de hash: {str(e2)}")
            raise e

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_username(username: str):
    try:
        print(f"Buscando usuario: {username}")
        user = users_collection.find_one({"username": username})
        print(f"Usuario encontrado: {user is not None}")
        if user:
            print(f"ID: {user.get('_id')}, Campos presentes: {', '.join(user.keys())}")
        return user
    except Exception as e:
        print(f"Error buscando usuario: {str(e)}")
        return None

def authenticate_user(username: str, password: str):
    try:
        print(f"Autenticando usuario: {username}")
        user = get_user_by_username(username)
        if not user:
            print(f"Usuario {username} no encontrado")
            return False
        
        # Asegurarnos de que la contraseña esté en el formato correcto
        if not isinstance(password, str):
            print("La contraseña no es una cadena de texto")
            return False
        
        print(f"Verificando contraseña para {username}")
        if "password" not in user:
            print(f"¡Campo de contraseña no encontrado en usuario {username}!")
            return False
            
        if not verify_password(password, user["password"]):
            print(f"Contraseña incorrecta para {username}")
            return False
            
        print(f"Autenticación exitosa para {username}")
        return user
    except Exception as e:
        print(f"Error durante la autenticación: {str(e)}")
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
