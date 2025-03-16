from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
import json

# Función para calcular la puntuación de historial de pagos (30-35% del puntaje)
def calculate_payment_history_score(historial_crediticio: Dict) -> Dict:
    """
    Calcula la puntuación basada en el historial de pagos.
    """
    total_payments = 0
    late_payments = 0
    
    # Contar pagos de cuentas de crédito
    for cuenta in historial_crediticio.get("cuentas_credito", []):
        historial_pagos = cuenta.get("historial_pagos", [])
        total_payments += len(historial_pagos)
        
        # Contar pagos tardíos
        for pago in historial_pagos:
            if "atrasado" in pago.get("estado", "").lower():
                late_payments += 1
    
    # Contar pagos de proveedores
    for proveedor in historial_crediticio.get("credito_proveedores", []):
        historial_pagos = proveedor.get("historial_pagos", [])
        total_payments += len(historial_pagos)
        
        # Contar pagos tardíos
        for pago in historial_pagos:
            if "atrasado" in pago.get("estado", "").lower():
                late_payments += 1
    
    # Si no hay pagos registrados, asignar un valor predeterminado
    if total_payments == 0:
        score_value = 65  # Puntuación predeterminada
        percentage = 100
        on_time_payments = 0
    else:
        on_time_payments = total_payments - late_payments
        percentage = (on_time_payments / total_payments) * 100
        
        # Convertir el porcentaje a una puntuación de 0-100
        if percentage >= 98:
            score_value = 100
        elif percentage >= 95:
            score_value = 90
        elif percentage >= 90:
            score_value = 80
        elif percentage >= 85:
            score_value = 70
        elif percentage >= 75:
            score_value = 60
        else:
            score_value = int(percentage / 2)  # Puntuación más baja para historial deficiente
    
    return {
        "score": score_value,
        "percentage": percentage,
        "weight": 0.35,  # 35% del puntaje total
        "total_payments": total_payments,
        "on_time_payments": on_time_payments,
        "late_payments": late_payments
    }

# Función para calcular la utilización del crédito (25-30% del puntaje)
def calculate_credit_utilization_score(historial_crediticio: Dict) -> Dict:
    """
    Calcula la puntuación basada en la utilización del crédito.
    """
    total_debt = 0
    total_available = 0
    
    # Sumar deudas y límites de crédito
    for cuenta in historial_crediticio.get("cuentas_credito", []):
        total_debt += cuenta.get("saldo_actual", 0)
        total_available += cuenta.get("limite_credito", 0)
    
    # Añadir créditos de proveedores
    for proveedor in historial_crediticio.get("credito_proveedores", []):
        total_debt += proveedor.get("saldo_actual", 0)
        total_available += proveedor.get("limite_credito", 0)
    
    # Si no hay crédito disponible, asignar un valor predeterminado
    if total_available == 0:
        utilization_pct = 0
        score_value = 50  # Puntuación neutral
    else:
        utilization_pct = (total_debt / total_available) * 100
        
        # Convertir la utilización a una puntuación
        if utilization_pct <= 10:
            score_value = 100
        elif utilization_pct <= 30:
            score_value = 90
        elif utilization_pct <= 50:
            score_value = 75
        elif utilization_pct <= 70:
            score_value = 60
        elif utilization_pct <= 90:
            score_value = 40
        else:
            score_value = 20
    
    return {
        "score": score_value,
        "utilization": utilization_pct,
        "weight": 0.30,  # 30% del puntaje total
        "total_debt": total_debt,
        "total_available": total_available
    }

# Función para calcular la antigüedad crediticia (15% del puntaje)
def calculate_credit_history_length_score(historial_crediticio: Dict) -> Dict:
    """
    Calcula la puntuación basada en la antigüedad del historial crediticio.
    """
    current_date = datetime.now()
    account_ages = []
    
    # Calcular la antigüedad de cada cuenta
    for cuenta in historial_crediticio.get("cuentas_credito", []):
        if "fecha_apertura" in cuenta:
            try:
                # Convertir la fecha de string a datetime
                fecha_apertura = datetime.strptime(cuenta["fecha_apertura"], "%Y-%m-%d")
                years = (current_date - fecha_apertura).days / 365.25
                
                account_ages.append({
                    "name": cuenta.get("entidad", "Cuenta"),
                    "years": years
                })
            except (ValueError, TypeError):
                # Si la fecha no está en el formato esperado, ignorar
                pass
    
    # Si no hay cuentas con fechas válidas, asignar un valor predeterminado
    if not account_ages:
        avg_age = 0
        score_value = 50  # Puntuación neutral
    else:
        avg_age = sum(account["years"] for account in account_ages) / len(account_ages)
        
        # Convertir la antigüedad a una puntuación
        # Más de 7 años = excelente, menos de 1 año = malo
        if avg_age >= 7:
            score_value = 100
        elif avg_age >= 5:
            score_value = 90
        elif avg_age >= 3:
            score_value = 80
        elif avg_age >= 2:
            score_value = 70
        elif avg_age >= 1:
            score_value = 60
        else:
            score_value = 50
    
    return {
        "score": score_value,
        "average_age": avg_age,
        "weight": 0.15,  # 15% del puntaje total
        "num_accounts": len(account_ages),
        "accounts": account_ages
    }

# Función para calcular la mezcla de créditos (10% del puntaje)
def calculate_credit_mix_score(historial_crediticio: Dict) -> Dict:
    """
    Calcula la puntuación basada en la mezcla de diferentes tipos de crédito.
    """
    credit_types = set()
    
    # Identificar tipos únicos de crédito
    for cuenta in historial_crediticio.get("cuentas_credito", []):
        if "tipo" in cuenta:
            credit_types.add(cuenta["tipo"])
    
    # Añadir créditos de proveedores como un tipo distinto
    if historial_crediticio.get("credito_proveedores", []):
        credit_types.add("Crédito Comercial")
    
    num_types = len(credit_types)
    
    # Convertir cantidad de tipos a una puntuación
    if num_types >= 4:
        score_value = 100
    elif num_types == 3:
        score_value = 90
    elif num_types == 2:
        score_value = 75
    elif num_types == 1:
        score_value = 60
    else:
        score_value = 50  # Sin historial crediticio
    
    return {
        "score": score_value,
        "num_types": num_types,
        "types": list(credit_types),
        "weight": 0.10  # 10% del puntaje total
    }

# Función para calcular nuevas solicitudes de crédito (10% del puntaje)
def calculate_new_credit_applications_score(historial_crediticio: Dict) -> Dict:
    """
    Calcula la puntuación basada en nuevas solicitudes de crédito en los últimos 12 meses.
    """
    current_date = datetime.now()
    recent_applications = 0
    
    # Contar solicitudes recientes (últimos 12 meses)
    for solicitud in historial_crediticio.get("solicitudes_credito_recientes", []):
        if "fecha" in solicitud:
            try:
                fecha_solicitud = datetime.strptime(solicitud["fecha"], "%Y-%m-%d")
                months_diff = (current_date.year - fecha_solicitud.year) * 12 + current_date.month - fecha_solicitud.month
                if months_diff <= 12:
                    recent_applications += 1
            except (ValueError, TypeError):
                # Si la fecha no está en el formato esperado, ignorar
                pass
    
    # Convertir cantidad de solicitudes a una puntuación
    if recent_applications == 0:
        score_value = 100
    elif recent_applications == 1:
        score_value = 90
    elif recent_applications == 2:
        score_value = 75
    elif recent_applications == 3:
        score_value = 60
    else:
        score_value = 40  # Muchas solicitudes recientes = riesgo mayor
    
    return {
        "score": score_value,
        "recent_applications": recent_applications,
        "weight": 0.10  # 10% del puntaje total
    }

# Función principal para calcular la puntuación crediticia completa
def calculate_credit_score(usuario_data: Dict) -> Dict:
    """
    Calcula la puntuación crediticia completa basada en todos los componentes.
    """
    historial_crediticio = usuario_data.get("historial_crediticio", {})
    
    # Calcular cada componente
    payment_history = calculate_payment_history_score(historial_crediticio)
    credit_utilization = calculate_credit_utilization_score(historial_crediticio)
    history_length = calculate_credit_history_length_score(historial_crediticio)
    credit_mix = calculate_credit_mix_score(historial_crediticio)
    new_applications = calculate_new_credit_applications_score(historial_crediticio)
    
    # Si no hay suficiente historial, generar valores simulados razonables
    if not historial_crediticio.get("cuentas_credito") and not historial_crediticio.get("credito_proveedores"):
        # Para usuarios sin datos, generar valores adaptados a la empresa
        # basados en información general para tener algo que mostrar
        informacion_general = usuario_data.get("informacion_general", {})
        
        # Antigüedad de la empresa afecta el puntaje
        if "fecha_fundacion" in informacion_general:
            try:
                fecha_fundacion = datetime.strptime(informacion_general["fecha_fundacion"], "%Y-%m-%d")
                years_active = (datetime.now() - fecha_fundacion).days / 365.25
                
                # Ajustar basado en antigüedad
                base_score = min(max(int(years_active * 10), 50), 85)
            except (ValueError, TypeError):
                base_score = 65  # Valor predeterminado
        else:
            base_score = 65  # Valor predeterminado
        
        # Ajustar basado en tamaño de empresa
        tamano = informacion_general.get("tamano_empresa", "").lower()
        if tamano == "grande":
            size_modifier = 10
        elif tamano == "mediana":
            size_modifier = 5
        elif tamano == "pequeña":
            size_modifier = 0
        else:
            size_modifier = -5
        
        # Puntaje final simulado
        simulated_score = min(max(base_score + size_modifier, 50), 90)
        
        # Valores representativos para la simulación
        payment_history["score"] = simulated_score + 5
        credit_utilization["score"] = simulated_score - 3
        history_length["score"] = simulated_score + 2
        credit_mix["score"] = simulated_score - 5
        new_applications["score"] = simulated_score + 10
    
    # Calcular el puntaje final ponderado
    weighted_score = (
        payment_history["score"] * payment_history["weight"] +
        credit_utilization["score"] * credit_utilization["weight"] +
        history_length["score"] * history_length["weight"] +
        credit_mix["score"] * credit_mix["weight"] +
        new_applications["score"] * new_applications["weight"]
    )
    
    # Escalar el puntaje a un rango de 300-850 (estándar común para puntajes crediticios)
    final_score = int(300 + (weighted_score / 100) * 550)
    
    # Crear historial simulado para la gráfica
    credit_score_history = generate_credit_score_history(final_score)
    
    return {
        "score": final_score,
        "components": {
            "payment_history": payment_history,
            "credit_utilization": credit_utilization,
            "history_length": history_length,
            "credit_mix": credit_mix,
            "new_applications": new_applications
        },
        "history": credit_score_history,
        "nivel": get_score_level(final_score)
    }

def get_score_level(score: int) -> Dict:
    """
    Determina el nivel del puntaje crediticio.
    """
    if score >= 750:
        return {
            "nivel": "Excelente",
            "color": "bg-gradient-to-r from-emerald-400 to-green-500",
            "description": "Tu puntaje te posiciona entre el 10% superior, calificando para las mejores tasas y condiciones crediticias."
        }
    elif score >= 670:
        return {
            "nivel": "Bueno",
            "color": "bg-gradient-to-r from-sky-400 to-blue-500",
            "description": "Tu puntaje está por encima del promedio, lo que te permite acceder a condiciones crediticias favorables."
        }
    elif score >= 580:
        return {
            "nivel": "Regular",
            "color": "bg-gradient-to-r from-amber-400 to-yellow-500",
            "description": "Tu puntaje está cerca del promedio. Aún tienes oportunidades de mejora para acceder a mejores condiciones crediticias."
        }
    elif score >= 500:
        return {
            "nivel": "Bajo",
            "color": "bg-gradient-to-r from-orange-400 to-amber-500",
            "description": "Tu puntaje está por debajo del promedio. Podrías enfrentar dificultades para obtener nuevos créditos sin garantías adicionales."
        }
    else:
        return {
            "nivel": "Pobre",
            "color": "bg-gradient-to-r from-red-400 to-rose-500",
            "description": "Tu puntaje es considerablemente bajo. Te recomendamos enfocarte en mejorar tu historial de pagos y reducir tus deudas actuales."
        }

def generate_credit_score_history(current_score: int) -> List[Dict]:
    """
    Genera un historial histórico simulado para la gráfica, basado en el puntaje actual.
    """
    # Definir los meses en español
    months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    current_month = datetime.now().month - 1  # Índice 0-11
    
    history = []
    
    # Calcular un punto de partida razonable (5-10% menor que el puntaje actual)
    start_score = max(300, int(current_score * 0.92))
    
    # Distribuir la diferencia a lo largo de 6 meses
    increment = (current_score - start_score) / 5
    
    for i in range(6):
        # Obtener el mes correspondiente
        month_index = (current_month - 5 + i) % 12
        month_name = months[month_index]
        
        # Calcular el puntaje para este mes con pequeña variación aleatoria
        variation = ((i % 2) * 2 - 1) * (i + 1)  # Alternando variación pequeña
        month_score = int(start_score + (increment * i) + variation)
        
        history.append({
            "month": month_name,
            "score": month_score
        })
    
    return history

# Función para calcular el PyME360 Trust Score
def calculate_trust_score(usuario_data: Dict) -> Dict:
    """
    Calcula el PyME360 Trust Score y sus componentes.
    """
    pyme360_data = usuario_data.get("pyme360_trust_score", {})
    informacion_general = usuario_data.get("informacion_general", {})
    
    # Si ya hay datos calculados, usarlos como base
    if pyme360_data and pyme360_data.get("calificacion_global", 0) > 50:
        return pyme360_data
    
    # Para usuarios nuevos, generar valores simulados basados en antigüedad, tamaño y sector
    componentes = pyme360_data.get("componentes", {})
    
    # Antigüedad de la empresa afecta el puntaje base
    if "fecha_fundacion" in informacion_general:
        try:
            fecha_fundacion = datetime.strptime(informacion_general["fecha_fundacion"], "%Y-%m-%d")
            years_active = (datetime.now() - fecha_fundacion).days / 365.25
            
            # Ajustar basado en antigüedad
            base_score = min(max(int(years_active * 8), 50), 85)
        except (ValueError, TypeError):
            base_score = 65  # Valor predeterminado
    else:
        base_score = 65  # Valor predeterminado
    
    # Ajustar basado en tamaño de empresa
    tamano = informacion_general.get("tamano_empresa", "").lower()
    if tamano == "grande":
        size_modifier = 8
    elif tamano == "mediana":
        size_modifier = 4
    elif tamano == "pequeña":
        size_modifier = 0
    else:
        size_modifier = -5
    
    # Ajustar basado en sector
    sector = informacion_general.get("sector", "").lower()
    sector_modifiers = {
        "tecnología": 10,
        "tecnologia": 10,
        "tecnológico": 10,
        "salud": 7,
        "financiero": 5,
        "manufacturero": 3,
        "comercio": 2,
        "servicios": 0,
        "agricultura": -2,
        "construcción": -3,
        "construccion": -3
    }
    sector_modifier = sector_modifiers.get(sector, 0)
    
    # Puntaje final calculado
    calculated_score = min(max(base_score + size_modifier + sector_modifier, 50), 95)
    
    # Variar los componentes ligeramente alrededor del puntaje calculado
    components = {
        "sostenibilidad": max(40, min(95, calculated_score - 5 + (0 if sector == "agricultura" else 10))),
        "cumplimiento_fiscal": max(60, min(98, calculated_score + 7)),
        "practicas_laborales": max(45, min(95, calculated_score - 2 + (7 if tamano == "grande" else 0))),
        "estabilidad_financiera": max(55, min(95, calculated_score + 2 + (years_active / 2 if 'years_active' in locals() else 0))),
        "puntualidad_pagos": max(50, min(95, calculated_score + 3)),
        "innovacion": max(35, min(90, calculated_score - 3 + (15 if sector == "tecnología" or sector == "tecnologia" else 0)))
    }
    
    # Actualizar componentes
    for key, score in components.items():
        if key in componentes:
            componentes[key]["puntuacion"] = int(score)
        else:
            componentes[key] = {"puntuacion": int(score), "metricas": [], "iniciativas": []}
    
    # Calcular calificación global (promedio ponderado)
    weights = {
        "sostenibilidad": 0.15,
        "cumplimiento_fiscal": 0.20,
        "practicas_laborales": 0.15,
        "estabilidad_financiera": 0.25,
        "puntualidad_pagos": 0.15,
        "innovacion": 0.10
    }
    
    weighted_score = sum(
        componentes[key]["puntuacion"] * weights[key]
        for key in weights.keys()
        if key in componentes
    )
    
    # Generar histórico simulado
    historico = generar_historico_trust_score(int(weighted_score))
    
    # Crear o actualizar el trust score
    updated_trust_score = {
        "calificacion_global": int(weighted_score),
        "componentes": componentes,
        "historico": historico,
        "beneficios_obtenidos": []
    }
    
    return updated_trust_score

def generar_historico_trust_score(current_score: int) -> List[Dict]:
    """
    Genera un historial histórico simulado para el PyME360 Trust Score.
    """
    # Definir los meses en español
    months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    
    current_date = datetime.now()
    current_month = current_date.month - 1  # Índice 0-11
    current_year = current_date.year
    
    historico = []
    
    # Calcular un punto de partida razonable (10% menor que el puntaje actual)
    start_score = max(40, int(current_score * 0.90))
    
    # Distribuir la diferencia a lo largo de 12 meses
    increment = (current_score - start_score) / 11
    
    for i in range(12):
        # Obtener el mes correspondiente
        month_index = (current_month - 11 + i) % 12
        month_name = months[month_index]
        
        # Ajustar el año si es necesario
        year = current_year - 1 if i < (11 - current_month) else current_year
        
        # Calcular el puntaje para este mes con pequeña variación aleatoria
        variation = ((i % 3) - 1) * 2  # Pequeña variación -2, 0, +2
        month_score = int(start_score + (increment * i) + variation)
        
        historico.append({
            "fecha": f"{year}-{month_index+1:02d}-01",  # Formato YYYY-MM-DD
            "puntuacion": month_score,
            "etiqueta": f"{month_name} {year}"
        })
    
    return historico
