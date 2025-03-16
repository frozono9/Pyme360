
import requests
import json

sector_cliente = "Mercado de muelles"

def query(user_message, sector_cliente):
    API_URL = "https://pr-az-pro-ai-ca-fw-uab11.livelyhill-0e586e2e.northeurope.azurecontainerapps.io/api/v1/prediction/5a87cdab-4d69-481b-a1bd-ef1a468bb41b"
    
    payload = {
        "overrideConfig": {
            "promptValues": {
                "sector_cliente": sector_cliente,
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
    input_person = "¿Podrías mostrarme un análisis de mi sector?"
    
    
    # Hacer la petición a Flowise
    output = query(input_person, sector_cliente)

    # Mostrar la respuesta
    if output:
        print(output)
    else:
        print("No se pudo obtener una respuesta de la API.")
