
import requests
import json

def query(user_message, data, prompt):
    """
    Query the AI service to get enhanced analysis from raw analysis data.
    
    Args:
        user_message: Message to send to the AI service
        data: JSON string containing the analysis data
        prompt: Prompt template for the AI service
        
    Returns:
        dict: Enhanced analysis results from the AI service
    """
    API_URL = "https://pr-az-pro-ai-ca-fw-uab11.livelyhill-0e586e2e.northeurope.azurecontainerapps.io/api/v1/prediction/e6abcbd4-e4be-4385-b8a5-5a855a255d9c"
    
    payload = {
        "overrideConfig": {
            "promptValues": {
                "data": data,
                "prompt": prompt
            }
        },
        "question": user_message
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()  # Raises exception for 4xx/5xx status codes
        
        # Process response
        json_response = response.json()
        
        # Try to parse the JSON content from the response text if it's a string
        if isinstance(json_response, dict) and 'text' in json_response:
            try:
                # Look for JSON in the text - assume the AI might return JSON embedded in text
                text = json_response['text']
                # Find JSON content between braces
                json_start = text.find('{')
                json_end = text.rfind('}') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_content = text[json_start:json_end]
                    parsed_json = json.loads(json_content)
                    return parsed_json
                else:
                    # If no JSON found, return the text as a message
                    return {
                        "message": text,
                        "formatted_output": "The AI returned text without JSON format."
                    }
            except json.JSONDecodeError:
                # If we can't parse JSON, return the raw text
                return {
                    "message": json_response['text'],
                    "formatted_output": "Could not parse JSON from the AI response."
                }
        else:
            # Return the response as-is if it's already JSON format
            return json_response
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")
        return {"error": f"API request failed: {str(e)}"}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": f"Unexpected error: {str(e)}"}

# This part only runs when the script is executed directly (for testing)
if __name__ == "__main__":
    test_data = '''
    {
      "resumen_datos": {
        "filas": 891,
        "columnas": 12,
        "tipos_datos": {
          "int64": 5,
          "object": 5,
          "float64": 2
        },
        "memoria_usada": "0.31 MB"
      },
      "analisis_target": {
        "distribucion": {
          "0": 549,
          "1": 342
        },
        "porcentaje": {
          "0": 0.6162,
          "1": 0.3838
        },
        "tipo_variable": "categorica"
      }
    }'''
    
    test_prompt = '''
    Resultados del Análisis de Datos para la PyME
    Visualizaciones para el Frontend
    #### A) Importancia de las Características
    Representa la relevancia de cada característica en la predicción del modelo.

    {
      "importancia_features": {
        "labels": ["cat__Sex_male", "num__Pclass", "cat__Sex_female", "num__Fare", "num__Age"],
        "values": [0.067, 0.049, 0.043, 0.031, 0.028]
      }
    }
    '''
    
    # Make a test request to the AI service
    output = query("Analiza estos datos y proporciona visualizaciones para el frontend", test_data, test_prompt)

    # Display the response
    if output:
        print(json.dumps(output, indent=2, ensure_ascii=False))
    else:
        print("Could not get a response from the API.")
