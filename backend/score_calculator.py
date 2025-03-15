
import datetime
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta

def calculate_credit_score(user_data: Dict) -> Dict:
    """
    Calculate credit score based on user data.
    Returns a dictionary with score and component scores.
    """
    try:
        # Extract credit history data
        if not user_data or "historial_crediticio" not in user_data:
            return {"error": "No credit history data available"}

        historial = user_data["historial_crediticio"]
        
        # Component 1: Payment History (35% of score)
        payment_history_score = calculate_payment_history(historial)
        
        # Component 2: Credit Utilization (30% of score)
        credit_utilization_score = calculate_credit_utilization(historial)
        
        # Component 3: Credit History Length (15% of score)
        history_length_score = calculate_credit_history_length(historial)
        
        # Component 4: Credit Mix (10% of score)
        credit_mix_score = calculate_credit_mix(historial)
        
        # Component 5: New Credit Applications (10% of score)
        new_credit_score = calculate_new_credit_applications(historial)
        
        # Calculate final weighted score
        final_score = (
            payment_history_score * 0.35 + 
            credit_utilization_score * 0.30 + 
            history_length_score * 0.15 + 
            credit_mix_score * 0.10 + 
            new_credit_score * 0.10
        )
        
        # Round to nearest integer
        final_score = round(final_score)
        
        return {
            "score": final_score,
            "components": {
                "payment_history": payment_history_score,
                "credit_utilization": credit_utilization_score,
                "history_length": history_length_score,
                "credit_mix": credit_mix_score,
                "new_credit": new_credit_score
            }
        }
    except Exception as e:
        print(f"Error calculating credit score: {str(e)}")
        return {"error": f"Error calculating credit score: {str(e)}"}

def calculate_payment_history(historial: Dict) -> int:
    """Calculate score for payment history (scale 0-100)"""
    try:
        # Count total payments and on-time payments
        total_payments = 0
        on_time_payments = 0
        
        # Process bank credit accounts
        for cuenta in historial.get("cuentas_credito", []):
            for pago in cuenta.get("historial_pagos", []):
                total_payments += 1
                if pago.get("estado") == "a tiempo":
                    on_time_payments += 1
        
        # Process supplier credit accounts
        for proveedor in historial.get("credito_proveedores", []):
            for pago in proveedor.get("historial_pagos", []):
                total_payments += 1
                if pago.get("estado") == "a tiempo":
                    on_time_payments += 1
        
        # Calculate percentage of on-time payments
        if total_payments == 0:
            return 50  # Neutral score if no payment history
        
        percentage = (on_time_payments / total_payments) * 100
        
        # Map percentage to score (100% = 100 points, 95% = 90 points, etc.)
        if percentage >= 99:
            return 100
        elif percentage >= 97:
            return 95
        elif percentage >= 95:
            return 90
        elif percentage >= 90:
            return 80
        elif percentage >= 85:
            return 70
        elif percentage >= 80:
            return 60
        elif percentage >= 75:
            return 50
        elif percentage >= 70:
            return 40
        else:
            return 30
    except Exception as e:
        print(f"Error in payment history calculation: {str(e)}")
        return 50  # Default to neutral score

def calculate_credit_utilization(historial: Dict) -> int:
    """Calculate score for credit utilization (scale 0-100)"""
    try:
        total_debt = 0
        total_credit = 0
        
        # Process bank credit accounts
        for cuenta in historial.get("cuentas_credito", []):
            total_debt += cuenta.get("saldo_actual", 0)
            total_credit += cuenta.get("limite_credito", 0)
        
        # Process supplier credit accounts
        for proveedor in historial.get("credito_proveedores", []):
            total_debt += proveedor.get("saldo_actual", 0)
            total_credit += proveedor.get("limite_credito", 0)
        
        # Calculate utilization rate
        if total_credit == 0:
            return 50  # Neutral score if no credit
            
        utilization = (total_debt / total_credit) * 100
        
        # Map utilization to score (lower is better)
        if utilization <= 10:
            return 100
        elif utilization <= 20:
            return 90
        elif utilization <= 30:
            return 80
        elif utilization <= 40:
            return 70
        elif utilization <= 50:
            return 60
        elif utilization <= 60:
            return 50
        elif utilization <= 70:
            return 40
        elif utilization <= 80:
            return 30
        else:
            return 20
    except Exception as e:
        print(f"Error in credit utilization calculation: {str(e)}")
        return 50  # Default to neutral score

def calculate_credit_history_length(historial: Dict) -> int:
    """Calculate score for credit history length (scale 0-100)"""
    try:
        today = datetime.now()
        total_age = 0
        account_count = 0
        
        # Process bank credit accounts
        for cuenta in historial.get("cuentas_credito", []):
            try:
                fecha_str = cuenta.get("fecha_apertura")
                if fecha_str:
                    fecha = datetime.strptime(fecha_str, "%Y-%m-%d")
                    age_years = (today - fecha).days / 365.25
                    total_age += age_years
                    account_count += 1
            except (ValueError, TypeError) as e:
                print(f"Date parsing error: {str(e)}")
        
        # Calculate average age
        if account_count == 0:
            return 50  # Neutral score if no accounts
            
        avg_age = total_age / account_count
        
        # Map average age to score
        if avg_age >= 10:
            return 100
        elif avg_age >= 7:
            return 90
        elif avg_age >= 5:
            return 80
        elif avg_age >= 3:
            return 70
        elif avg_age >= 2:
            return 60
        elif avg_age >= 1:
            return 50
        else:
            return 40
    except Exception as e:
        print(f"Error in credit history length calculation: {str(e)}")
        return 50  # Default to neutral score

def calculate_credit_mix(historial: Dict) -> int:
    """Calculate score for credit mix (scale 0-100)"""
    try:
        # Count unique credit types
        credit_types = set()
        
        # Process bank credit accounts
        for cuenta in historial.get("cuentas_credito", []):
            credit_types.add(cuenta.get("tipo", ""))
        
        # Process supplier credit accounts (add as "trade credit")
        if historial.get("credito_proveedores", []):
            credit_types.add("credito_comercial")
        
        # Count unique types (excluding empty strings)
        unique_types = len([t for t in credit_types if t])
        
        # Map count to score
        if unique_types >= 4:
            return 100
        elif unique_types == 3:
            return 90
        elif unique_types == 2:
            return 75
        elif unique_types == 1:
            return 60
        else:
            return 40
    except Exception as e:
        print(f"Error in credit mix calculation: {str(e)}")
        return 50  # Default to neutral score

def calculate_new_credit_applications(historial: Dict) -> int:
    """Calculate score for new credit applications (scale 0-100)"""
    try:
        # Cut-off date (12 months ago)
        today = datetime.now()
        cutoff_date = today - timedelta(days=365)
        
        # Count recent applications
        recent_count = 0
        
        for solicitud in historial.get("solicitudes_credito_recientes", []):
            try:
                fecha_str = solicitud.get("fecha")
                if fecha_str:
                    fecha = datetime.strptime(fecha_str, "%Y-%m-%d")
                    if fecha > cutoff_date:
                        recent_count += 1
            except (ValueError, TypeError) as e:
                print(f"Date parsing error: {str(e)}")
        
        # Map count to score (fewer is better)
        if recent_count == 0:
            return 100
        elif recent_count == 1:
            return 90
        elif recent_count == 2:
            return 80
        elif recent_count == 3:
            return 60
        elif recent_count == 4:
            return 40
        else:
            return 20
    except Exception as e:
        print(f"Error in new credit applications calculation: {str(e)}")
        return 50  # Default to neutral score

def calculate_pyme360_trust_score(user_data: Dict) -> Dict:
    """
    Calculate PyME360 Trust Score based on user data.
    Returns a dictionary with score and component scores.
    """
    try:
        if not user_data:
            return {"error": "No user data available"}
        
        # Component 1: Sustainability (15%)
        sustainability_score = calculate_sustainability_score(user_data)
        
        # Component 2: Tax Compliance (20%)
        tax_compliance_score = calculate_tax_compliance_score(user_data)
        
        # Component 3: Labor Practices (15%)
        labor_practices_score = calculate_labor_practices_score(user_data)
        
        # Component 4: Financial Stability (20%)
        financial_stability_score = calculate_financial_stability_score(user_data)
        
        # Component 5: Payment Punctuality (20%)
        payment_punctuality_score = calculate_payment_punctuality_score(user_data)
        
        # Component 6: Innovation (10%)
        innovation_score = calculate_innovation_score(user_data)
        
        # Calculate final weighted score
        final_score = (
            sustainability_score * 0.15 + 
            tax_compliance_score * 0.20 + 
            labor_practices_score * 0.15 + 
            financial_stability_score * 0.20 + 
            payment_punctuality_score * 0.20 + 
            innovation_score * 0.10
        )
        
        # Round to nearest integer
        final_score = round(final_score)
        
        # Generate historical data
        today = datetime.now()
        historical_data = generate_historical_trust_scores(final_score, 4)
        
        # Determine benefits based on score
        benefits = determine_trust_score_benefits(final_score)
        
        return {
            "calificacion_global": final_score,
            "componentes": {
                "sostenibilidad": {
                    "puntuacion": sustainability_score,
                    "metricas": extract_sustainability_metrics(user_data),
                    "iniciativas": extract_sustainability_initiatives(user_data)
                },
                "cumplimiento_fiscal": {
                    "puntuacion": tax_compliance_score,
                    "metricas": extract_tax_compliance_metrics(user_data),
                    "historial": extract_tax_compliance_history(user_data)
                },
                "practicas_laborales": {
                    "puntuacion": labor_practices_score,
                    "metricas": extract_labor_practices_metrics(user_data),
                    "iniciativas": extract_labor_practices_initiatives(user_data)
                },
                "estabilidad_financiera": {
                    "puntuacion": financial_stability_score,
                    "metricas": extract_financial_stability_metrics(user_data),
                    "tendencias": extract_financial_stability_trends(user_data)
                },
                "puntualidad_pagos": {
                    "puntuacion": payment_punctuality_score,
                    "metricas": extract_payment_punctuality_metrics(user_data),
                    "historial": extract_payment_punctuality_history(user_data)
                },
                "innovacion": {
                    "puntuacion": innovation_score,
                    "metricas": extract_innovation_metrics(user_data),
                    "iniciativas": extract_innovation_initiatives(user_data)
                }
            },
            "historico": historical_data,
            "beneficios_obtenidos": benefits
        }
    except Exception as e:
        print(f"Error calculating PyME360 trust score: {str(e)}")
        return {"error": f"Error calculating PyME360 trust score: {str(e)}"}

def calculate_sustainability_score(user_data: Dict) -> int:
    """Calculate sustainability score based on user data"""
    # For now, use existing data if available, otherwise generate a reasonable score
    try:
        if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
            existing_score = user_data["pyme360_trust_score"]["componentes"]["sostenibilidad"]["puntuacion"]
            return existing_score
        
        # Generate a score between 55-85 based on company age and other factors
        base_score = 70
        
        # Adjust based on company age if available
        if "informacion_general" in user_data and "fecha_fundacion" in user_data["informacion_general"]:
            try:
                fecha_str = user_data["informacion_general"]["fecha_fundacion"]
                fecha = datetime.strptime(fecha_str, "%Y-%m-%d")
                years = (datetime.now() - fecha).days / 365.25
                
                # Older companies tend to have better sustainability practices
                if years > 10:
                    base_score += 10
                elif years > 5:
                    base_score += 5
            except (ValueError, TypeError):
                pass
        
        # Add some randomness
        import random
        base_score += random.randint(-5, 5)
        
        # Ensure score is within bounds
        return max(50, min(90, base_score))
    except Exception as e:
        print(f"Error in sustainability calculation: {str(e)}")
        return 70  # Default score

def calculate_tax_compliance_score(user_data: Dict) -> int:
    """Calculate tax compliance score based on user data"""
    # Similar pattern to sustainability score
    try:
        if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
            existing_score = user_data["pyme360_trust_score"]["componentes"]["cumplimiento_fiscal"]["puntuacion"]
            return existing_score
        
        # Tax compliance tends to be high for established businesses
        base_score = 85
        
        # Add some randomness
        import random
        base_score += random.randint(-5, 5)
        
        return max(75, min(95, base_score))
    except Exception as e:
        print(f"Error in tax compliance calculation: {str(e)}")
        return 85  # Default score

def calculate_labor_practices_score(user_data: Dict) -> int:
    """Calculate labor practices score based on user data"""
    try:
        if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
            existing_score = user_data["pyme360_trust_score"]["componentes"]["practicas_laborales"]["puntuacion"]
            return existing_score
            
        # Base score depends on industry
        base_score = 75
        
        # Adjust based on company size if available
        if "informacion_general" in user_data:
            size = user_data["informacion_general"].get("tamano_empresa", "").lower()
            employees = user_data["informacion_general"].get("numero_empleados", 0)
            
            # Larger companies tend to have more formal labor practices
            if size == "grande" or employees > 200:
                base_score += 10
            elif size == "mediana" or employees > 50:
                base_score += 5
            
        # Add some randomness
        import random
        base_score += random.randint(-5, 5)
        
        return max(60, min(90, base_score))
    except Exception as e:
        print(f"Error in labor practices calculation: {str(e)}")
        return 75  # Default score

def calculate_financial_stability_score(user_data: Dict) -> int:
    """Calculate financial stability score based on user data"""
    try:
        if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
            existing_score = user_data["pyme360_trust_score"]["componentes"]["estabilidad_financiera"]["puntuacion"]
            return existing_score
        
        # Base financial stability score
        base_score = 80
        
        # Check profit margins if available
        if "margen_beneficio" in user_data and "datos_mensuales" in user_data["margen_beneficio"]:
            # Use the last 3 months of data
            margins = user_data["margen_beneficio"]["datos_mensuales"][-3:]
            if margins:
                avg_margin = sum(item.get("margen_neto", 0) for item in margins) / len(margins)
                
                # Adjust score based on margins
                if avg_margin > 0.20:  # 20%
                    base_score += 10
                elif avg_margin > 0.15:  # 15%
                    base_score += 5
                elif avg_margin < 0.05:  # 5%
                    base_score -= 5
                elif avg_margin < 0:  # negative
                    base_score -= 15
            
        # Add some randomness
        import random
        base_score += random.randint(-3, 3)
        
        return max(50, min(95, base_score))
    except Exception as e:
        print(f"Error in financial stability calculation: {str(e)}")
        return 80  # Default score

def calculate_payment_punctuality_score(user_data: Dict) -> int:
    """Calculate payment punctuality score based on user data"""
    try:
        if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
            existing_score = user_data["pyme360_trust_score"]["componentes"]["puntualidad_pagos"]["puntuacion"]
            return existing_score
        
        # Use payment history from credit score as a base
        if "historial_crediticio" in user_data:
            credit_score = calculate_credit_score(user_data)
            if "components" in credit_score:
                payment_history_score = credit_score["components"]["payment_history"]
                # Payment punctuality closely aligns with payment history from credit score
                return payment_history_score
        
        # Default score if no payment history data
        return 85
    except Exception as e:
        print(f"Error in payment punctuality calculation: {str(e)}")
        return 85  # Default score

def calculate_innovation_score(user_data: Dict) -> int:
    """Calculate innovation score based on user data"""
    try:
        if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
            existing_score = user_data["pyme360_trust_score"]["componentes"]["innovacion"]["puntuacion"]
            return existing_score
        
        # Base innovation score - typically lower than other components
        base_score = 65
        
        # Innovation tends to be higher in certain sectors
        if "informacion_general" in user_data:
            sector = user_data["informacion_general"].get("sector", "").lower()
            
            tech_sectors = ["tecnología", "tecnologia", "software", "electrónica", "electronica", "telecomunicaciones"]
            modern_sectors = ["biotech", "biotecnología", "biotecnologia", "energías renovables", "energias renovables", "farmacéutica", "farmaceutica"]
            
            if any(s in sector for s in tech_sectors):
                base_score += 15
            elif any(s in sector for s in modern_sectors):
                base_score += 10
            
        # Age factor - younger companies tend to be more innovative
        if "informacion_general" in user_data and "fecha_fundacion" in user_data["informacion_general"]:
            try:
                fecha_str = user_data["informacion_general"]["fecha_fundacion"]
                fecha = datetime.strptime(fecha_str, "%Y-%m-%d")
                years = (datetime.now() - fecha).days / 365.25
                
                if years < 5:
                    base_score += 10
                elif years < 10:
                    base_score += 5
                elif years > 20:
                    base_score -= 5
            except (ValueError, TypeError):
                pass
            
        # Add some randomness
        import random
        base_score += random.randint(-5, 5)
        
        return max(45, min(90, base_score))
    except Exception as e:
        print(f"Error in innovation calculation: {str(e)}")
        return 65  # Default score

def extract_sustainability_metrics(user_data: Dict) -> List[Dict]:
    """Extract or generate sustainability metrics"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["sostenibilidad"]["metricas"]
    
    # Generate default metrics
    return [
        {"metrica": "Eficiencia Energética", "valor": 76, "industria": 68},
        {"metrica": "Gestión de Residuos", "valor": 82, "industria": 70},
        {"metrica": "Uso Sostenible de Materiales", "valor": 75, "industria": 72}
    ]

def extract_sustainability_initiatives(user_data: Dict) -> List[Dict]:
    """Extract or generate sustainability initiatives"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["sostenibilidad"]["iniciativas"]
    
    # Generate default initiatives
    return [
        {"iniciativa": "Reducción de Consumo Energético", "estado": "En progreso", "impacto": "Medio"},
        {"iniciativa": "Reciclaje de Materiales", "estado": "Implementado", "impacto": "Alto"},
        {"iniciativa": "Uso de Materiales Sostenibles", "estado": "Planeado", "impacto": "Alto"}
    ]

def extract_tax_compliance_metrics(user_data: Dict) -> List[Dict]:
    """Extract or generate tax compliance metrics"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["cumplimiento_fiscal"]["metricas"]
    
    # Generate default metrics
    return [
        {"metrica": "Presentación de Declaraciones", "valor": 100, "industria": 85},
        {"metrica": "Pago de Impuestos", "valor": 98, "industria": 80},
        {"metrica": "Auditorías Fiscales", "valor": 85, "industria": 75}
    ]

def extract_tax_compliance_history(user_data: Dict) -> List[Dict]:
    """Extract or generate tax compliance history"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["cumplimiento_fiscal"]["historial"]
    
    # Generate default history
    current_year = datetime.now().year
    return [
        {"ano": current_year-1, "declaraciones_tiempo": "Sí", "pagos_tiempo": "Sí", "auditorias": "Superada"},
        {"ano": current_year-2, "declaraciones_tiempo": "Sí", "pagos_tiempo": "Sí", "auditorias": "No aplicable"},
        {"ano": current_year-3, "declaraciones_tiempo": "Sí", "pagos_tiempo": "Sí", "auditorias": "No aplicable"}
    ]

def extract_labor_practices_metrics(user_data: Dict) -> List[Dict]:
    """Extract or generate labor practices metrics"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["practicas_laborales"]["metricas"]
    
    # Generate default metrics
    return [
        {"metrica": "Rotación de Personal", "valor": 12, "industria": 18},
        {"metrica": "Horas de Capacitación", "valor": 45, "industria": 35},
        {"metrica": "Incidentes Laborales", "valor": 2, "industria": 5}
    ]

def extract_labor_practices_initiatives(user_data: Dict) -> List[Dict]:
    """Extract or generate labor practices initiatives"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["practicas_laborales"]["iniciativas"]
    
    # Generate default initiatives
    return [
        {"iniciativa": "Programa de Bienestar", "estado": "Implementado", "impacto": "Alto"},
        {"iniciativa": "Flexibilidad Laboral", "estado": "En progreso", "impacto": "Medio"},
        {"iniciativa": "Capacitación Continua", "estado": "Implementado", "impacto": "Alto"}
    ]

def extract_financial_stability_metrics(user_data: Dict) -> List[Dict]:
    """Extract or generate financial stability metrics"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["estabilidad_financiera"]["metricas"]
    
    # Generate default metrics
    return [
        {"metrica": "Consistencia de Ingresos", "valor": 5.8, "industria": 8.2},
        {"metrica": "Ratio Deuda/Patrimonio", "valor": 0.65, "industria": 0.75},
        {"metrica": "Reservas de Efectivo", "valor": 2.6, "industria": 2.0}
    ]

def extract_financial_stability_trends(user_data: Dict) -> List[Dict]:
    """Extract or generate financial stability trends"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["estabilidad_financiera"]["tendencias"]
    
    # Generate default trends
    return [
        {"periodo": "Últimos 12 meses", "crecimiento_anual": "Estable", "volatilidad": "Baja"},
        {"periodo": "Últimos 36 meses", "crecimiento_anual": "Positivo", "volatilidad": "Media"}
    ]

def extract_payment_punctuality_metrics(user_data: Dict) -> List[Dict]:
    """Extract or generate payment punctuality metrics"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["puntualidad_pagos"]["metricas"]
    
    # Generate default metrics
    return [
        {"metrica": "Pagos a Tiempo", "valor": 97.8, "industria": 88.5},
        {"metrica": "Días Promedio de Pago", "valor": 28.4, "industria": 35.0},
        {"metrica": "Incidentes de Pago", "valor": 0.5, "industria": 2.1}
    ]

def extract_payment_punctuality_history(user_data: Dict) -> List[Dict]:
    """Extract or generate payment punctuality history"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["puntualidad_pagos"]["historial"]
    
    # Generate default history
    current_year = datetime.now().year
    return [
        {"ano": current_year-1, "a_tiempo": "98%", "dias_promedio": 28, "incidentes": 1},
        {"ano": current_year-2, "a_tiempo": "97%", "dias_promedio": 29, "incidentes": 2},
        {"ano": current_year-3, "a_tiempo": "95%", "dias_promedio": 32, "incidentes": 3}
    ]

def extract_innovation_metrics(user_data: Dict) -> List[Dict]:
    """Extract or generate innovation metrics"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["innovacion"]["metricas"]
    
    # Generate default metrics
    return [
        {"metrica": "Inversión en I+D", "valor": 3.5, "industria": 2.8},
        {"metrica": "Nuevos Productos", "valor": 6, "industria": 5},
        {"metrica": "Adopción Tecnológica", "valor": 72, "industria": 65}
    ]

def extract_innovation_initiatives(user_data: Dict) -> List[Dict]:
    """Extract or generate innovation initiatives"""
    if "pyme360_trust_score" in user_data and "componentes" in user_data["pyme360_trust_score"]:
        return user_data["pyme360_trust_score"]["componentes"]["innovacion"]["iniciativas"]
    
    # Generate default initiatives
    return [
        {"iniciativa": "Desarrollo de Plataforma Digital", "estado": "En progreso", "lanzamiento": "2023-Q4", "impacto": "Alto"},
        {"iniciativa": "Automatización de Procesos", "estado": "Implementado", "lanzamiento": "2023-Q2", "impacto": "Medio"},
        {"iniciativa": "Renovación de Productos", "estado": "Planeado", "lanzamiento": "2024-Q1", "impacto": "Alto"}
    ]

def generate_historical_trust_scores(current_score: int, quarters: int) -> List[Dict]:
    """Generate historical trust scores for past quarters"""
    today = datetime.now()
    result = []
    
    for i in range(quarters):
        # Calculate quarter
        quarter_num = today.month // 3
        if quarter_num == 0: 
            quarter_num = 4
            year = today.year - 1
        else:
            year = today.year
            
        quarter = f"{year}-Q{quarter_num}"
        
        # Previous scores trending slightly lower
        previous_score = max(50, current_score - (i+1) * 3)
        variation = current_score - previous_score
        
        result.append({
            "trimestre": quarter,
            "puntuacion": previous_score,
            "variacion": variation
        })
        
        # Move back one quarter
        today = today.replace(month=max(1, today.month - 3))
        
    # Return in reverse chronological order
    return result

def determine_trust_score_benefits(score: int) -> List[Dict]:
    """Determine benefits based on trust score"""
    benefits = []
    
    # Base benefits
    if score >= 50:  # Bronze level
        benefits.append({
            "beneficio": "Visibilidad Básica",
            "entidad": "PyME360",
            "detalle": "Listado en directorio de empresas"
        })
        
    if score >= 65:  # Silver level
        benefits.append({
            "beneficio": "Tasas Preferenciales",
            "entidad": "Banco Asociado",
            "detalle": "Descuento de 0.5% en tasas de interés"
        })
        benefits.append({
            "beneficio": "Sello de Certificación",
            "entidad": "PyME360",
            "detalle": "Insignia digital verificable"
        })
        
    if score >= 80:  # Gold level
        benefits.append({
            "beneficio": "Financiamiento Prioritario",
            "entidad": "Fondo de Inversión",
            "detalle": "Acceso a líneas de crédito exclusivas"
        })
        benefits.append({
            "beneficio": "Networking Premium",
            "entidad": "Cámara de Comercio",
            "detalle": "Invitaciones a eventos exclusivos mensuales"
        })
        
    if score >= 90:  # Platinum level
        benefits.append({
            "beneficio": "Programa de Mentores",
            "entidad": "Asociación Empresarial",
            "detalle": "Acceso a mentores ejecutivos"
        })
        benefits.append({
            "beneficio": "Financiamiento Internacional",
            "entidad": "Banco Internacional",
            "detalle": "Préstamos para expansión con condiciones especiales"
        })
        
    return benefits

# Testing functions if needed
def test_calculations():
    """Test the calculations with sample data"""
    from pprint import pprint
    
    # Sample credit data
    credit_sample = {
        "historial_crediticio": {
            "cuentas_credito": [
                {
                    "id": "CRE001",
                    "tipo": "Préstamo",
                    "entidad": "Bancolombia",
                    "fecha_apertura": "2018-05-10",
                    "monto_original": 450000000,
                    "saldo_actual": 125000000,
                    "limite_credito": 450000000,
                    "tasa_interes": 12.5,
                    "plazo_meses": 60,
                    "estado": "activo",
                    "historial_pagos": [
                        {"fecha": "2023-01-15", "monto": 9375000, "estado": "a tiempo"},
                        {"fecha": "2023-02-15", "monto": 9375000, "estado": "a tiempo"},
                        {"fecha": "2023-03-15", "monto": 9375000, "estado": "a tiempo"}
                    ]
                }
            ],
            "credito_proveedores": [
                {
                    "id": "PROV001",
                    "proveedor": "TextilMax",
                    "terminos_pago": "30 días",
                    "limite_credito": 120000000,
                    "saldo_actual": 45000000,
                    "historial_pagos": [
                        {"fecha": "2023-01-30", "monto": 15000000, "estado": "a tiempo"},
                        {"fecha": "2023-02-28", "monto": 20000000, "estado": "a tiempo"},
                        {"fecha": "2023-03-30", "monto": 18000000, "estado": "a tiempo"}
                    ]
                }
            ],
            "solicitudes_credito_recientes": [
                {
                    "fecha": "2023-06-12",
                    "entidad": "Banco de Occidente",
                    "tipo": "Línea de Crédito",
                    "monto": 300000000,
                    "estado": "aprobado"
                }
            ],
            "incidentes_crediticios": []
        }
    }
    
    # Print credit score calculation
    print("Credit Score Calculation:")
    credit_result = calculate_credit_score(credit_sample)
    pprint(credit_result)
    
    # Print trust score calculation
    print("\nTrust Score Calculation:")
    trust_result = calculate_pyme360_trust_score(credit_sample)
    pprint(trust_result)

if __name__ == "__main__":
    test_calculations()
