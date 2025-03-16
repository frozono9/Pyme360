
import requests
import json

data = '''
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
  "analisis_estadistico": {
    "numericas": {
      "mean": {
        "PassengerId": 446.0,
        "Pclass": 2.308641975308642,
        "Age": 29.69911764705882,
        "SibSp": 0.5230078563411896,
        "Parch": 0.38159371492704824,
        "Fare": 32.204207968574636
      },
      "std": {
        "PassengerId": 257.3538420152301,
        "Pclass": 0.836071240977049,
        "Age": 14.526497332334042,
        "SibSp": 1.1027434322934317,
        "Parch": 0.8060572211299483,
        "Fare": 49.6934285971809
      },
      "min": {
        "PassengerId": 1.0,
        "Pclass": 1.0,
        "Age": 0.42,
        "SibSp": 0.0,
        "Parch": 0.0,
        "Fare": 0.0
      },
      "max": {
        "PassengerId": 891.0,
        "Pclass": 3.0,
        "Age": 80.0,
        "SibSp": 8.0,
        "Parch": 6.0,
        "Fare": 512.3292
      },
      "skew": {
        "PassengerId": 0.0,
        "Pclass": -0.6305479068752845,
        "Age": 0.38910778230082704,
        "SibSp": 3.6953517271630565,
        "Parch": 2.7491170471010933,
        "Fare": 4.787316519674893
      },
      "kurtosis": {
        "PassengerId": -1.1999999999999997,
        "Pclass": -1.2800149715782825,
        "Age": 0.17827415364210353,
        "SibSp": 17.880419726645968,
        "Parch": 9.778125179021648,
        "Fare": 33.39814088089868
      },
      "unicos": {
        "PassengerId": 891,
        "Pclass": 3,
        "Age": 88,
        "SibSp": 7,
        "Parch": 7,
        "Fare": 248
      }
    },
    "categoricas": {
      "Name": {
        "valores_unicos": 891
      },
      "Sex": {
        "top_valores": {
          "male": 577,
          "female": 314
        },
        "valores_unicos": 2,
        "moda": "male"
      },
      "Ticket": {
        "valores_unicos": 681
      },
      "Cabin": {
        "valores_unicos": 148
      },
      "Embarked": {
        "top_valores": {
          "S": 644,
          "C": 168,
          "Q": 77
        },
        "valores_unicos": 4,
        "moda": "S"
      }
    }
  },
  "valores_faltantes": {
    "conteo": {
      "Age": 177,
      "Cabin": 687,
      "Embarked": 2
    },
    "porcentaje": {
      "Age": 19.87,
      "Cabin": 77.1,
      "Embarked": 0.22
    }
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
  },
  "correlaciones": {
    "mensaje": "Análisis de correlaciones no aplicable o variable objetivo no numérica."
  },
  "modelo": {
    "accuracy": 0.8386,
    "precision": 0.8427,
    "recall": 0.8386,
    "f1": 0.8346,
    "matriz_confusion": [
      [
        125,
        9
      ],
      [
        27,
        62
      ]
    ]
  },
  "importancia_features": {
    "importancias_completas": [
      {
        "caracteristica": "cat__Sex_male",
        "importancia": 0.06726457399103136,
        "std": 0.006341764853691027
      },
      {
        "caracteristica": "num__Pclass",
        "importancia": 0.04932735426008968,
        "std": 0.012683529707382003
      },
      {
        "caracteristica": "cat__Sex_female",
        "importancia": 0.04334828101644247,
        "std": 0.002113921617897009
      },
      {
        "caracteristica": "num__Fare",
        "importancia": 0.03139013452914796,
        "std": 0.0036614196454158227
      },
      {
        "caracteristica": "num__Age",
        "importancia": 0.028400597907324337,
        "std": 0.005592910892038792
      },
      {
        "caracteristica": "num__Parch",
        "importancia": 0.022421524663677084,
        "std": 0.0036614196454158227
      },
      {
        "caracteristica": "num__PassengerId",
        "importancia": 0.02092675635276527,
        "std": 0.005592910892038792
      },
      {
        "caracteristica": "cat__Embarked_S",
        "importancia": 0.017937219730941683,
        "std": 0.013201436272537889
      },
      {
        "caracteristica": "cat__Cabin_C23 C25 C27",
        "importancia": 0.014947683109118056,
        "std": 0.004227843235793966
      },
      {
        "caracteristica": "cat__Embarked_C",
        "importancia": 0.007473841554559028,
        "std": 0.009214370706979023
      },
      {
        "caracteristica": "cat__Cabin_infrequent_sklearn",
        "importancia": 0.005979073243647215,
        "std": 0.005592910892038743
      },
      {
        "caracteristica": "cat__Ticket_1601",
        "importancia": 0.004484304932735439,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Embarked_Q",
        "importancia": 0.001494768310911813,
        "std": 0.004227843235794018
      },
      {
        "caracteristica": "cat__Ticket_infrequent_sklearn",
        "importancia": 0.001494768310911813,
        "std": 0.005592910892038792
      },
      {
        "caracteristica": "cat__Ticket_3101295",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Ticket_CA 2144",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Ticket_CA. 2343",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Name_van Melkebeke, Mr. Philemon",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Cabin_E101",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Cabin_F2",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Name_de Messemaeker, Mrs. Guillaume Joseph (Emma)",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Name_de Pelsmaeker, Mr. Alfons",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Name_infrequent_sklearn",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "cat__Name_van Billiard, Mr. Austin Blyler",
        "importancia": 0.0,
        "std": 0.0
      },
      {
        "caracteristica": "num__SibSp",
        "importancia": -0.001494768310911813,
        "std": 0.002113921617897009
      },
      {
        "caracteristica": "cat__Cabin_G6",
        "importancia": -0.004484304932735439,
        "std": 0.0
      }
    ]
  },
  "visualizaciones_data": {
    "distribucion_target": {
      "labels": [
        0,
        1
      ],
      "counts": [
        549,
        342
      ]
    }
  },
  "insights": [
    "El modelo logra una buena precisión de 0.84",
    "La importancia de las características indica cuánto contribuye cada una a las predicciones del modelo. Cuanto mayor sea la puntuación de importancia, más influyente es la característica.",
    "Las características más influyentes en el modelo son: cat__Sex_male, num__Pclass, cat__Sex_female, num__Fare, num__Age.",
    "Considere enfocarse en estas características clave para análisis adicionales, ingeniería de características o recolección de datos."
  ]
}'''
prompt = '''
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


#### B) Distribución de la Variable Objetivo
Muestra la proporción de cada categoría en la variable objetivo.

{
  "distribucion_target": {
    "labels": ["No sobreviviente", "Sobreviviente"],
    "values": [549, 342]
  }
}


#### C) Valores Faltantes en la Base de Datos
Indica cuántos datos faltan por variable.

{
  "valores_faltantes": {
    "labels": ["Age", "Cabin", "Embarked"],
    "values": [177, 687, 2]
  }
}


Recomendaciones para Mejorar la PyME
El análisis revela información clave para optimizar el negocio:

{
  "recomendaciones": [
    "El modelo muestra que la variable 'Sexo' es una de las más influyentes. Si tu negocio se enfoca en clientes de diferentes géneros, podrías personalizar ofertas específicas.",
    "La variable 'Clase del boleto' también tiene un impacto en la predicción. Considera analizar la segmentación de precios y categorías de productos o servicios.",
    "Se observan valores faltantes en 'Cabina' y 'Edad'. Si estos datos son relevantes, podría ser beneficioso mejorar la captura de información en el sistema."
  ]
}


---

Estos datos permiten visualizar patrones importantes y generar estrategias para mejorar la gestión y toma de decisiones en la PyME.'''
def query(user_message, data, prompt):
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
        response.raise_for_status()  # Esto lanzará una excepción para códigos de estado HTTP 4xx/5xx
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al hacer la solicitud: {e}")
        return {"text": f"Lo siento, ha ocurrido un error: {str(e)}"}

# Esta parte solo se ejecuta si el script se corre directamente (para pruebas)
if __name__ == "__main__":
    input_person = "Haz lo que te pido"
    
    
    # Hacer la petición a Flowise
    output = query(input_person, data, prompt)

    # Mostrar la respuesta
    if output:
        print(output)
    else:
        print("No se pudo obtener una respuesta de la API.")
