
import requests
import json

API_URL = "https://pr-az-pro-ai-ca-fw-uab11.livelyhill-0e586e2e.northeurope.azurecontainerapps.io/api/v1/prediction/1d9e7016-0dc7-4b1b-b9b0-9309a192a067"

def query(input_json, input_person):
    """
    Consulta al asistente IA de financiamiento.
    
    Args:
        input_json: JSON con los datos del usuario (MongoDB)
        input_person: Pregunta del usuario sobre financiamiento
        
    Returns:
        La respuesta del asistente IA
    """
    if not input_person.strip():
        return "Por favor, ingresa tu consulta sobre financiamiento."
    
    payload = {
        "overrideConfig": {
            "promptValues": {
                "user_data": input_json
            }
        },
        "question": input_person
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al hacer la solicitud: {e}")
        return f"Lo siento, hubo un error al procesar tu consulta: {str(e)}"

# Para pruebas locales
if __name__ == "__main__":
    # Ejemplo de datos de usuario y pregunta
    user_data = '{"username": "test", "empresa_data": {"nombre": "Tech Corp", "sector": "Tecnología"}}'
    test_question = "Hola, soy una empresa de tecnología y quiero saber qué opciones de financiamiento tengo disponibles."
    
    # Hacer la petición a Flowise
    output = query(user_data, test_question)
    
    # Mostrar la respuesta
    print(output)
