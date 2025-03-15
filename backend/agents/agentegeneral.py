import requests
import json


input_person = "Que es el Trust Score?"
user_data = 'Me llamo Juan y soy de España'
API_URL = "https://pr-az-pro-ai-ca-fw-uab11.livelyhill-0e586e2e.northeurope.azurecontainerapps.io/api/v1/prediction/936a6585-3d65-4ac7-a645-66cddc2f7de5"

def query(user_message, info_web, user_data):
    payload = {
        "overrideConfig": {
            "promptValues": {
            "info_web": info_web,
            "user_data": user_data
            }
            },
            "question" : user_message}
    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()  # Esto lanzará una excepción para códigos de estado HTTP 4xx/5xx
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al hacer la solicitud: {e}")
        return None

# Ejemplo de JSON con datos de empresa, empleados y país
# user data es la llamada a mongo db
# Cargar info_web.json desde el directorio actual


with open('web_database.txt', 'r') as file:
    info_web = file.read()

with open('caso1.json', 'r') as file2:
    user_data = json.load(file2)

# Hacer la petición a Flowise
output = query(input_person, info_web, user_data)

# Mostrar la respuesta
if output:
    print(output)
else:
    print("No se pudo obtener una respuesta de la API.")