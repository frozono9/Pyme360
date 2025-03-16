
import requests
import json
import random
from datetime import datetime, timedelta

# Sector por defecto para pruebas
sector_cliente = "Mercado de muelles"

def query(user_message, sector_cliente, pais_cliente):
    """
    Función para consultar tendencias de mercado.
    
    Args:
        user_message: Pregunta o consulta del usuario
        sector_cliente: Sector económico del cliente
        pais_cliente: País donde opera el cliente
        
    Returns:
        dict: Contiene los datos de tendencias de mercado y análisis
    """
    API_URL = "https://pr-az-pro-ai-ca-fw-uab11.livelyhill-0e586e2e.northeurope.azurecontainerapps.io/api/v1/prediction/5a87cdab-4d69-481b-a1bd-ef1a468bb41b"
    
    # Si no hay un mensaje específico, usar una consulta predeterminada
    if not user_message or user_message.strip() == "":
        user_message = f"Muestra un análisis de tendencias para el sector {sector_cliente} en {pais_cliente}"
    
    payload = {
        "overrideConfig": {
            "promptValues": {
                "sector_cliente": sector_cliente,
                "pais_cliente": pais_cliente
            }
        },
        "question": user_message
    }
    
    try:
        # Intentar obtener datos reales de la API
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()
        api_response = response.json()
        
        # Si la respuesta contiene texto pero no datos estructurados,
        # generar datos simulados y añadirlos a la respuesta
        trends_data = generate_market_trends_data(sector_cliente, pais_cliente)
        
        # Combinar la respuesta de la API con los datos generados
        result = {
            "text": api_response.get("text", ""),
            "trends_data": trends_data
        }
        
        return result
    except Exception as e:
        print(f"Error al hacer la solicitud: {e}")
        # En caso de error, devolver solo datos simulados
        trends_data = generate_market_trends_data(sector_cliente, pais_cliente)
        return {
            "text": f"Análisis de tendencias para el sector {sector_cliente} en {pais_cliente}. Los datos son simulados debido a un error de conexión.",
            "trends_data": trends_data
        }

def generate_market_trends_data(sector, pais):
    """
    Genera datos simulados de tendencias de mercado para visualización.
    
    Args:
        sector: El sector económico para el que generar datos
        pais: El país para el que generar datos
        
    Returns:
        dict: Datos simulados de tendencias de mercado
    """
    # Fecha actual como punto de partida
    current_date = datetime.now()
    
    # Generar datos de tendencias para los últimos 12 meses
    months = 12
    dates = [(current_date - timedelta(days=30*i)).strftime("%b %Y") for i in range(months)]
    dates.reverse()  # Ordenar cronológicamente
    
    # Ajustar la tendencia base según el país
    pais_factors = {
        "México": 1.0,
        "Colombia": 1.1,
        "Chile": 1.2,
        "Perú": 0.9,
        "Argentina": 0.85,
        "España": 1.15
    }
    
    pais_factor = pais_factors.get(pais, 1.0)
    
    # Tendencia principal del sector (crecimiento base entre 1-5%, ajustado por país)
    base_growth = random.uniform(1, 5) * pais_factor
    
    # Datos para gráfica de líneas (crecimiento del sector y subsectores)
    sector_trend = []
    value = 100  # Valor inicial
    for i in range(months):
        # Añadir algo de variabilidad al crecimiento
        monthly_change = base_growth + random.uniform(-2, 2)
        value = value * (1 + monthly_change/100)
        sector_trend.append(round(value, 2))
    
    # Crear 2-3 subsectores con diferentes tasas de crecimiento
    subsectors = []
    subsector_names = generate_subsectors(sector)
    
    for name in subsector_names:
        subsector_growth = base_growth + random.uniform(-1, 3)  # Variación respecto al sector
        subsector_data = []
        sub_value = 100  # Valor inicial
        
        for i in range(months):
            monthly_change = subsector_growth + random.uniform(-2, 2)
            sub_value = sub_value * (1 + monthly_change/100)
            subsector_data.append(round(sub_value, 2))
        
        subsectors.append({
            "name": name,
            "data": subsector_data
        })
    
    # Datos para gráfica de barras (factores de impacto)
    impact_factors = generate_impact_factors(sector, pais)
    
    # Datos para gráfica de radar (oportunidades por área)
    opportunity_areas = generate_opportunity_areas(sector)
    
    # Datos para gráfica de proyección (próximos 6 meses)
    projection_dates = [(current_date + timedelta(days=30*i)).strftime("%b %Y") for i in range(1, 7)]
    projection_data = []
    
    # Continuar la proyección desde el último valor
    proj_value = sector_trend[-1]
    for i in range(6):
        # La proyección puede ser más optimista o pesimista
        proj_monthly_change = base_growth + random.uniform(-1, 3)
        proj_value = proj_value * (1 + proj_monthly_change/100)
        projection_data.append(round(proj_value, 2))
    
    # Escenarios alternativos (optimista y pesimista)
    optimistic_data = [round(projection_data[i] * (1 + random.uniform(2, 4)/100), 2) for i in range(6)]
    pessimistic_data = [round(projection_data[i] * (1 - random.uniform(1, 3)/100), 2) for i in range(6)]
    
    return {
        "sector": sector,
        "pais": pais,
        "historic": {
            "dates": dates,
            "sector_trend": sector_trend,
            "subsectors": subsectors
        },
        "impact_factors": impact_factors,
        "opportunity_areas": opportunity_areas,
        "projection": {
            "dates": projection_dates,
            "baseline": projection_data,
            "optimistic": optimistic_data,
            "pessimistic": pessimistic_data
        },
        "recommendations": generate_recommendations(sector, pais)
    }

def generate_subsectors(sector):
    """Genera nombres de subsectores basados en el sector principal"""
    # Mapeo de sectores a posibles subsectores
    sector_mappings = {
        "Tecnología": ["Software", "Hardware", "Servicios Cloud", "IA y Automatización"],
        "Retail": ["E-commerce", "Tiendas físicas", "Marketplace", "Dropshipping"],
        "Servicios": ["Consultoría", "Servicios profesionales", "Servicios al cliente", "Outsourcing"],
        "Manufactura": ["Producción a escala", "Fabricación especializada", "Ensamblaje", "Fabricación aditiva"],
        "Mercado de muelles": ["Muelles industriales", "Muelles residenciales", "Accesorios", "Servicios de instalación"],
        "Textil": ["Ropa casual", "Textiles técnicos", "Moda sostenible", "Textiles para el hogar"]
    }
    
    # Si el sector no está en el mapeo, crear subsectores genéricos
    if sector not in sector_mappings:
        words = sector.split()
        base_word = words[-1] if len(words) > 0 else sector
        return [f"{base_word} Premium", f"{base_word} Estándar", f"{base_word} Económico"]
    
    # Seleccionar aleatoriamente 3 subsectores del mapeo
    selected = random.sample(sector_mappings[sector], min(3, len(sector_mappings[sector])))
    return selected

def generate_impact_factors(sector, pais="México"):
    """Genera factores de impacto para el sector y país"""
    # Factores comunes para todos los sectores
    common_factors = [
        "Digitalización",
        "Sostenibilidad",
        "Cambios regulatorios",
        "Nuevos competidores",
        "Cambios demográficos",
        "Innovación tecnológica",
        "Cadena de suministro"
    ]
    
    # Factores específicos por país
    pais_factors = {
        "México": ["T-MEC", "Nearshoring", "Economía circular"],
        "Colombia": ["Acuerdos de paz", "Desarrollo sostenible", "Transformación digital"],
        "Chile": ["Minería verde", "Energías renovables", "Comercio internacional"],
        "Perú": ["Estabilidad macroeconómica", "Turismo sostenible", "Exportaciones"],
        "Argentina": ["Mercado de capitales", "Desarrollo agropecuario", "Exportaciones"],
        "España": ["Fondos europeos", "Turismo sostenible", "Economía verde"]
    }
    
    # Obtener factores específicos del país
    pais_specific = pais_factors.get(pais, [])
    
    # Combinar y seleccionar factores
    all_factors = common_factors + pais_specific
    selected_factors = random.sample(all_factors, min(5, len(all_factors)))
    
    # Asignar impactos (1-10)
    impact_data = []
    for factor in selected_factors:
        # Los factores específicos del país tienden a tener mayor impacto
        base_impact = 7 if factor in pais_specific else 5
        impact_data.append({
            "factor": factor,
            "impact": random.randint(base_impact, 10)
        })
    
    # Ordenar por impacto descendente
    impact_data.sort(key=lambda x: x["impact"], reverse=True)
    return impact_data

def generate_opportunity_areas(sector):
    """Genera áreas de oportunidad para el sector"""
    areas = [
        "Innovación de producto",
        "Experiencia de cliente",
        "Eficiencia operativa",
        "Expansión de mercado",
        "Marketing y ventas",
        "Sostenibilidad",
        "Talento y capacitación"
    ]
    
    data = []
    for area in areas:
        data.append({
            "area": area,
            "value": random.randint(30, 95)
        })
    
    return data

def generate_recommendations(sector, pais="México"):
    """Genera recomendaciones estratégicas basadas en el sector y país"""
    # Recomendaciones generales
    general_recommendations = [
        "Invertir en transformación digital para optimizar procesos internos y mejorar la experiencia del cliente.",
        "Desarrollar una estrategia de sostenibilidad que alinee los valores de la empresa con las expectativas del mercado.",
        "Explorar nuevos canales de distribución y modelos de negocio para diversificar las fuentes de ingresos.",
        "Fortalecer las relaciones con proveedores clave para asegurar la estabilidad de la cadena de suministro.",
        "Implementar programas de capacitación para adaptar el talento interno a las nuevas demandas del mercado."
    ]
    
    # Recomendaciones específicas por país
    pais_recommendations = {
        "México": [
            "Aprovechar las oportunidades del nearshoring para captar clientes e inversiones de Estados Unidos.",
            "Explorar programas gubernamentales de apoyo a PyMEs en el marco del T-MEC.",
            "Reforzar la seguridad en la cadena logística para mejorar la competitividad internacional."
        ],
        "Colombia": [
            "Integrar prácticas de sostenibilidad alineadas con los objetivos nacionales de desarrollo verde.",
            "Invertir en tecnologías que mejoren la seguridad y trazabilidad de productos y servicios.",
            "Explorar alianzas estratégicas con actores de la economía naranja para diversificar la oferta."
        ],
        "Chile": [
            "Aprovechar los incentivos para la transformación digital de PyMEs ofrecidos por CORFO.",
            "Explorar oportunidades en el mercado de energías renovables en rápido crecimiento.",
            "Adoptar estándares internacionales que faciliten la exportación a mercados desarrollados."
        ],
        "España": [
            "Postular a fondos Next Generation EU para proyectos de digitalización y sostenibilidad.",
            "Adaptar la oferta para capitalizar el crecimiento del turismo sostenible y experiencial.",
            "Explorar alianzas con empresas europeas para acceder a mercados del norte de Europa."
        ]
    }
    
    # Obtener recomendaciones específicas del país
    specific_recs = pais_recommendations.get(pais, [])
    
    # Combinar y seleccionar recomendaciones (priorizar las específicas)
    all_recs = specific_recs + general_recommendations
    num_to_select = min(3, len(all_recs))
    
    # Asegurar al menos una recomendación específica del país si existe
    if specific_recs and num_to_select > 0:
        # Seleccionar al menos una recomendación específica
        selected_specific = random.sample(specific_recs, min(1, len(specific_recs)))
        # Completar con recomendaciones generales
        remaining = num_to_select - len(selected_specific)
        if remaining > 0:
            selected_general = random.sample(general_recommendations, min(remaining, len(general_recommendations)))
        else:
            selected_general = []
        selected = selected_specific + selected_general
    else:
        # Si no hay recomendaciones específicas, usar solo generales
        selected = random.sample(general_recommendations, num_to_select)
    
    return selected

# Esta parte solo se ejecuta si el script se corre directamente (para pruebas)
if __name__ == "__main__":
    input_person = "¿Podrías mostrarme un análisis de tendencias para mi sector?"
    
    # Hacer la petición al agente
    output = query(input_person, sector_cliente)

    # Mostrar la respuesta
    if output:
        print(json.dumps(output, indent=2))
    else:
        print("No se pudo obtener una respuesta del agente.")
