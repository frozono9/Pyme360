
import requests
import json


def query(user_message, user_data=None):
    API_URL = "https://pr-az-pro-ai-ca-fw-uab11.livelyhill-0e586e2e.northeurope.azurecontainerapps.io/api/v1/prediction/e258654e-610c-4245-97fe-89fd0103f64f"
    
    payload = {
        "overrideConfig": {
            "promptValues": {
                "user_data": json.dumps(user_data) if user_data else "{}"
            }
        },
        "question": user_message
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()  # Esto lanzará una excepción para códigos de estado HTTP 4xx/5xx
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al hacer la solicitud: {e}")
        return {"text": f"Lo siento, ha ocurrido un error: {str(e)}"}

# Esta parte solo se ejecuta si el script se corre directamente (para pruebas)
if __name__ == "__main__":
    input_person = "Que es el Trust Score?"
    
    # Cargar datos de prueba
    with open('web_database.txt', 'r') as file:
        info_web = file.read()

    with open('caso1.json', 'r') as file2:
        user_data = json.load(file2)
    
    # Hacer la petición a Flowise
    output = query(input_person, user_data)

    # Mostrar la respuesta
    if output:
        print(output)
    else:
        print("No se pudo obtener una respuesta de la API.")
