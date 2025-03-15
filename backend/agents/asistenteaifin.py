import requests
import json

### aqui va la query del prompt. EJ; describe tu situacion...
input_person = "Hola, soy una persona y quiero saber si mi empresa Tech Corp, con empleados Alice y Bob, en USA, puede tener éxito en el mercado."

### aqui va el database del usuario
user_data = 'me llamo juan'

API_URL = "https://pr-az-pro-ai-ca-fw-uab11.livelyhill-0e586e2e.northeurope.azurecontainerapps.io/api/v1/prediction/1d9e7016-0dc7-4b1b-b9b0-9309a192a067"

def query(input_json, input_person):
    payload = {
        "overrideConfig": {
            "promptValues": {
            "user_data": input_json
            }
            },
            "question" : input_person}
    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()  # Esto lanzará una excepción para códigos de estado HTTP 4xx/5xx
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al hacer la solicitud: {e}")
        return None


# Hacer la petición a Flowise
output = query(user_data, input_person)

# Mostrar la respuesta
if output:
    print(output)
else:
    print("No se pudo obtener una respuesta de la API.")