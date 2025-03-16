
import requests
import json


def query(user_message, info_web, user_data):
    API_URL = "https://pr-az-pro-ai-ca-fw-uab11.livelyhill-0e586e2e.northeurope.azurecontainerapps.io/api/v1/prediction/aaa92823-3669-4804-baf4-241a65f8d58f"
    
    payload = {
        "overrideConfig": {
            "promptValues": {
                "info_web": info_web,
                "user_data": user_data
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
    input_person = "Proporcioname el esquema del roadmap general que tengo que seguir para mejorar mi empresa, el formato de salida del roadmap es un titulo general, una descripcion pequeña de la accion necesaria, el porcentaje de completado,y el nivel de prioridad"
    
    # Cargar datos de prueba
    
    info_web = '''# GUÍA COMPLETA DE LA PLATAFORMA PyME360

## INTRODUCCIÓN

PyME360 es una plataforma integral diseñada para pequeñas y medianas empresas que ofrece herramientas de certificación de confiabilidad empresarial, evaluación crediticia alternativa, y diversos módulos de gestión adaptados al perfil real de cada empresa.

## PÁGINAS PRINCIPALES Y SUS FUNCIONALIDADES

### 1. Página de Inicio (/)

La página inicial presenta una visión general de la plataforma PyME360 con las siguientes secciones:

- **Hero**: Sección principal con mensaje de bienvenida y botones de llamada a la acción como "Comenzar" o "Conocer más".
- **Features**: Resumen visual de las principales características de la plataforma, organizadas en tarjetas informativas.
- **ModulesSection**: Presentación de los módulos disponibles con breves descripciones y enlaces para explorarlos.
- **CertificationSystem**: Explicación del sistema de certificación PyME360 Trust Score y sus niveles (Bronce, Plata, Oro y Platino).

### 2. Página de Acceso (/acceso)

Esta página permite a los usuarios iniciar sesión en la plataforma y contiene:

- **Formulario de login**: Con campos para usuario/email y contraseña.
- **Enlace para recuperación de contraseña**: Texto "¿Olvidaste tu contraseña?" que redirige al proceso de recuperación.
- **Enlace para registro**: Texto "¿No tienes cuenta? Regístrate" para nuevos usuarios.

### 3. Dashboard (/dashboard)

El dashboard es la página principal después de iniciar sesión y ofrece una vista general del estado de tu empresa:

- **Encabezado personalizado**: Muestra un saludo con tu nombre y el botón de cierre de sesión.
- **Tarjetas de resumen**: Primera fila con indicadores clave:
   - Estado General: Indicador visual de la salud empresarial.
   - Financiamiento: AI Credit Score actual.
   - Crecimiento: Comparativa respecto al mes anterior.
   - Alertas: Notificaciones que requieren atención.
- **Módulos Principales**: Sección principal con tarjetas de acceso a cada módulo:
   - Financiamiento: Resumen del AI Credit Score y botón para ver opciones.
   - Gestión Empresarial: Tareas pendientes y acceso al dashboard completo.
   - Cumplimiento: Próximos vencimientos regulatorios y calendario.
   - Crecimiento: Oportunidades de expansión detectadas.
   - Búsqueda de Empleados: Candidatos disponibles y acceso a la herramienta.
   - Certificación: Nivel actual y progreso hacia el siguiente nivel.

### 4. Página de Certificación (/certificacion)

Esta página muestra el detalle de tu PyME360 Trust Score y contiene:

- **Resumen del Trust Score**: En la parte superior:
   - Puntuación global (valor numérico del 1-100).
   - Nivel de certificación actual (Platino/Oro/Plata/Bronce).
   - Indicador de puntos necesarios para alcanzar el siguiente nivel.
- **Gráfico de componentes**: Sección central izquierda con un gráfico radar mostrando los 6 componentes del Trust Score:
   - Cumplimiento Fiscal
   - Prácticas Laborales
   - Estabilidad Financiera
   - Puntualidad de Pagos
   - Innovación
   - Sostenibilidad
- **Evolución histórica**: Sección central derecha con gráfico de línea que muestra la evolución de tu puntuación en los últimos 6 meses.
- **Recomendaciones de mejora**: Sección inferior izquierda con sugerencias específicas para mejorar tu puntuación.
- **Beneficios actuales**: Sección inferior derecha que lista las ventajas asociadas a tu nivel de certificación actual.

### 5. Página de AI Credit Score (/credit-score)

Esta página muestra tu evaluación crediticia alternativa con:

- **Puntuación principal**: Valor del credit score y nivel de riesgo asociado.
- **Factores de influencia**: Elementos que impactan positiva y negativamente en tu puntuación, como:
   - Historial de pagos a proveedores y entidades financieras
   - Estabilidad de ingresos y fluctuaciones estacionales
   - Crecimiento sostenible y manejo de deuda
   - Comportamiento financiero histórico
- **Recomendaciones**: Sugerencias específicas para mejorar tu puntuación crediticia.

### 6. Página de Financiamiento (/financiamiento)

Este módulo te permite acceder a opciones de financiamiento adaptadas a tu perfil y contiene:

- **Estado crediticio**: Resumen de tu situación crediticia actual.
- **Opciones recomendadas**: Productos financieros sugeridos según tu perfil.
- **Enlaces a submódulos**:
   - Marketplace Financiero: Catálogo de opciones de financiamiento.
   - Preparación para Financiamiento: Asistente para preparar solicitudes.

### 7. Página de Gestión Empresarial (/gestion)

Este módulo ofrece herramientas para optimizar la administración de tu empresa y contiene:

- **KPI Dashboard**: Indicadores clave de desempeño en diferentes áreas.
- **Tareas pendientes**: Lista organizada de actividades por completar.
- **Eficiencia operativa**: Métricas y recomendaciones para mejorar procesos internos.

### 8. Página de Cumplimiento (/cumplimiento)

Este módulo te ayuda a mantenerte al día con tus obligaciones regulatorias y contiene:

- **Calendario de obligaciones**: Fechas de vencimientos legales, fiscales y regulatorios.
- **Estado de cumplimiento**: Porcentaje de obligaciones completadas y pendientes.
- **Alertas de próximos vencimientos**: Notificaciones sobre fechas cercanas.

### 9. Página de Crecimiento (/crecimiento)

Este módulo ofrece herramientas para expansión y desarrollo con:

- **Oportunidades detectadas**: Posibles áreas de expansión para tu negocio.
- **Análisis de mercado**: Información sectorial relevante con tendencias actuales.
- **Alianzas estratégicas**: Posibles colaboraciones detectadas según tu perfil.

### 10. Página de Búsqueda de Empleados (/busqueda-empleados)

Esta herramienta te permite encontrar talento verificado para tu empresa y contiene:

- **Filtros de búsqueda**: Opciones para filtrar candidatos por habilidades, experiencia, ubicación, etc.
- **Perfiles recomendados**: Candidatos sugeridos según tus necesidades específicas.
- **Gestión de vacantes**: Herramientas para administrar tus posiciones abiertas.

### 11. Marketplace Financiero (/marketplace-financiamiento)

Este submódulo del área de financiamiento muestra un catálogo de opciones disponibles:

- **Ofertas personalizadas**: Productos financieros adaptados específicamente a tu perfil.
- **Comparador**: Herramienta para contrastar diferentes opciones según tus necesidades.
- **Solicitud directa**: Formularios pre-llenados para aplicación rápida a las opciones seleccionadas.

### 12. Preparación para Financiamiento (/preparacion-financiamiento)

Este submódulo te ayuda a maximizar tus posibilidades de aprobación:

- **Checklist documental**: Lista interactiva de documentos requeridos y su estado de preparación.
- **Recomendaciones de presentación**: Consejos específicos para mejorar tu solicitud.
- **Vista previa de aplicación**: Simulación de cómo verán tu solicitud las entidades financieras.

### 13. Página de Nosotros (/nosotros)

Esta página proporciona información sobre la plataforma y su equipo:

- **Misión y visión**: Propósito y objetivos a largo plazo de PyME360.
- **Equipo**: Integrantes clave del proyecto y sus roles.
- **Contacto**: Información para comunicarse con soporte técnico o comercial.

## PREGUNTAS FRECUENTES (FAQs)

### Sobre Certificación

**P: ¿Cómo puedo mejorar rápidamente mi Trust Score?**
R: Enfócate en los componentes con menor puntuación e implementa las recomendaciones prioritarias. Las acciones relacionadas con Puntualidad de Pagos y Cumplimiento Fiscal suelen tener impacto más rápido.

**P: ¿Con qué frecuencia se actualiza mi Trust Score?**
R: La puntuación se actualiza semanalmente, cada lunes. Las acciones importantes pueden reflejarse en actualizaciones especiales más inmediatas.

**P: ¿Cómo puedo utilizar mi certificación fuera de la plataforma?**
R: En la sección de Beneficios puedes generar un distintivo digital para tu sitio web, descargar un certificado PDF oficial y obtener un código QR de verificación para incluir en propuestas comerciales.

### Sobre AI Credit Score

**P: ¿Qué pasa si mi empresa tiene un bajo AI Credit Score?**
R: Sigue las recomendaciones personalizadas en la sección correspondiente. Prioriza acciones relacionadas con la regularización de pagos e implementa un plan de estabilización financiera. La puntuación puede mejorar significativamente en 2-3 meses con acciones consistentes.

**P: ¿Las entidades financieras tradicionales reconocen este score?**
R: Sí, PyME360 tiene alianzas con más de 30 instituciones financieras que consideran el AI Credit Score en sus evaluaciones. Algunas lo usan como complemento y otras como evaluación principal.

**P: ¿Cómo se diferencia del score crediticio tradicional?**
R: A diferencia del score tradicional que se basa principalmente en historial bancario, el AI Credit Score analiza más de 50 variables operativas y financieras de tu negocio, incluyendo comportamiento de pagos a proveedores, estacionalidad de ingresos y sostenibilidad de crecimiento.

### Sobre Financiamiento

**P: ¿Cómo comparar efectivamente las opciones de financiamiento?**
R: Utiliza el comparador del Marketplace Financiero que permite analizar hasta 5 opciones simultáneamente. Además de la tasa, evalúa el CAT (Costo Anual Total), comisiones, penalizaciones por prepago y flexibilidad de plazos.

**P: ¿Qué documentación necesito para solicitar financiamiento?**
R: Varía según el tipo de financiamiento, pero generalmente incluye: estados financieros de los últimos 2 años, declaraciones fiscales anuales, estados de cuenta bancarios de los últimos 6 meses, comprobante de domicilio comercial y constitución legal de la empresa. La herramienta de Preparación para Financiamiento te mostrará los requisitos específicos para cada opción.

**P: ¿Cuánto tiempo toma recibir respuesta a una solicitud?**
R: El tiempo promedio de respuesta inicial es de 3 días hábiles. Las solicitudes completadas a través de la herramienta de Preparación para Financiamiento reciben respuesta hasta 40% más rápido.

### Sobre la Plataforma en General

**P: ¿Mis datos están seguros en PyME360?**
R: Sí, PyME360 cumple con los estándares más estrictos de seguridad y privacidad de datos. Utilizamos encriptación de extremo a extremo y nunca compartimos información sensible sin tu autorización explícita.

**P: ¿Puedo integrar PyME360 con mis sistemas existentes?**
R: Sí, ofrecemos APIs de integración con los principales ERPs, sistemas contables y CRMs del mercado. Consulta la sección de integraciones en tu perfil para las opciones disponibles.

**P: ¿Cómo puedo maximizar el valor de PyME360 para mi empresa?**
R: Completa tu perfil al 100%, conecta tus sistemas existentes mediante las integraciones disponibles, implementa las recomendaciones prioritarias y utiliza la plataforma regularmente para monitorear tu progreso. Los usuarios que acceden al menos 3 veces por semana reportan mejoras 2.5 veces más rápidas.

## SOLUCIÓN DE PROBLEMAS COMUNES

### No puedo iniciar sesión

**Posibles causas y soluciones**:
- **Contraseña incorrecta**: Utiliza la opción "¿Olvidaste tu contraseña?" en la pantalla de acceso.
- **Cuenta bloqueada**: Después de 5 intentos fallidos, la cuenta se bloquea por 30 minutos. Espera o contacta a soporte.
- **Correo no verificado**: Revisa tu bandeja de entrada (y spam) para el correo de verificación o solicita uno nuevo en la pantalla de acceso.

### Mi AI Credit Score es bajo a pesar de tener buenas finanzas

**Posibles causas y soluciones**:
- **Información incompleta**: Asegúrate de haber conectado todas tus cuentas bancarias y sistemas de facturación.
- **Historial limitado**: Las empresas con menos de 6 meses de operación reciben puntuaciones iniciales más conservadoras.
- **Inconsistencias en reportes**: Verifica que tus reportes fiscales coincidan con tus movimientos bancarios.
- **Sectores de alto riesgo**: Algunos sectores tienen evaluaciones más estrictas; revisa los factores específicos de tu industria.

### No veo opciones de financiamiento que esperaba

**Posibles causas y soluciones**:
- **Perfil incompleto**: Completa al 100% tu perfil financiero para desbloquear más opciones.
- **Documentación pendiente**: Algunas opciones avanzadas requieren documentación específica verificada.
- **Filtros demasiado específicos**: Prueba ampliando los criterios de búsqueda en el Marketplace.
- **Score insuficiente**: Algunas opciones premium requieren un mínimo de AI Credit Score o nivel de certificación.

### El gráfico de componentes del Trust Score no carga

**Posibles causas y soluciones**:
- **Conexión lenta**: Recarga la página o intenta más tarde.
- **Navegador desactualizado**: Actualiza a la última versión de Chrome, Firefox, Safari o Edge.
- **Datos insuficientes**: Si tu empresa es nueva en la plataforma, algunos componentes pueden estar en evaluación.
- **Bloqueo de scripts**: Asegúrate de que tu navegador permite scripts de la plataforma.

### No recibo las alertas de cumplimiento

**Posibles causas y soluciones**:
- **Preferencias incorrectas**: Verifica la configuración de notificaciones en tu perfil.
- **Correo marcado como spam**: Añade noreply@pyme360.com a tus contactos seguros.
- **Calendario no sincronizado**: Asegúrate de que hayas autorizado la sincronización con tu calendario.
- **Usuario incorrecto**: Confirma que el usuario designado para notificaciones de cumplimiento sea el correcto.

## AYUDA Y SOPORTE

Si necesitas asistencia, puedes acceder a las siguientes opciones:

- **Centro de ayuda**: Accesible desde el ícono de interrogación (?) en la esquina inferior derecha en todas las páginas.
- **Chat en vivo**: Disponible en horario laboral (9:00-18:00) haciendo clic en el ícono de chat en la parte inferior derecha.
- **Correo de soporte**: support@pyme360.com para consultas que requieran mayor elaboración.
- **Tutoriales interactivos**: Disponibles en cada módulo haciendo clic en "¿Cómo funciona esto?".
- **Webinars semanales**: Sesiones en vivo para resolver dudas comunes, accesibles desde el calendario en el Centro de ayuda.
`;
'''

    
    user_data = '''{
    "informacion_general": {
      "nombre_empresa": "Textiles Andinos S.A.S.",
      "nit": "900.456.789-1",
      "direccion": "Calle 73 #45-28, Medellín, Antioquia",
      "telefono": "+57 4 234 5678",
      "correo": "contacto@textilesandinos.com.co",
      "sitio_web": "www.textilesandinos.com.co",
      "fecha_fundacion": "2010-03-15",
      "sector": "Manufactura Textil",
      "tamano_empresa": "Mediana",
      "numero_empleados": 87,
      "representante_legal": "Carolina Gómez Restrepo"
    },
    "historial_crediticio": {
      "cuentas_credito": [
        {
          "id": "CRE001",
          "tipo": "Préstamo Bancario",
          "entidad": "Bancolombia",
          "fecha_apertura": "2018-05-10",
          "monto_original": 450000000,
          "saldo_actual": 125000000,
          "limite_credito": 450000000,
          "tasa_interes": 0.12,
          "plazo_meses": 60,
          "estado": "Activo",
          "historial_pagos": [
            {"fecha": "2023-12-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-11-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-10-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-09-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-08-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-07-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-06-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-05-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-04-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-03-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-02-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2023-01-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-12-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-11-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-10-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-09-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-08-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-07-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-06-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-05-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-04-15", "monto": 9750000, "estado": "Atrasado (30 días)"},
            {"fecha": "2022-03-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-02-15", "monto": 9750000, "estado": "A tiempo"},
            {"fecha": "2022-01-15", "monto": 9750000, "estado": "A tiempo"}
          ]
        },
        {
          "id": "CRE002",
          "tipo": "Línea de Crédito",
          "entidad": "Banco de Bogotá",
          "fecha_apertura": "2020-08-22",
          "monto_original": 0,
          "saldo_actual": 65000000,
          "limite_credito": 150000000,
          "tasa_interes": 0.18,
          "plazo_meses": 0,
          "estado": "Activo",
          "historial_pagos": [
            {"fecha": "2023-12-05", "monto": 15000000, "estado": "A tiempo"},
            {"fecha": "2023-11-05", "monto": 10000000, "estado": "A tiempo"},
            {"fecha": "2023-10-05", "monto": 8000000, "estado": "A tiempo"},
            {"fecha": "2023-09-05", "monto": 12000000, "estado": "A tiempo"},
            {"fecha": "2023-08-05", "monto": 9000000, "estado": "A tiempo"},
            {"fecha": "2023-07-05", "monto": 7500000, "estado": "A tiempo"},
            {"fecha": "2023-06-05", "monto": 11000000, "estado": "A tiempo"},
            {"fecha": "2023-05-05", "monto": 8500000, "estado": "A tiempo"},
            {"fecha": "2023-04-05", "monto": 9500000, "estado": "A tiempo"},
            {"fecha": "2023-03-05", "monto": 10500000, "estado": "A tiempo"},
            {"fecha": "2023-02-05", "monto": 7000000, "estado": "A tiempo"},
            {"fecha": "2023-01-05", "monto": 13000000, "estado": "A tiempo"},
            {"fecha": "2022-12-05", "monto": 9000000, "estado": "A tiempo"},
            {"fecha": "2022-11-05", "monto": 11000000, "estado": "A tiempo"},
            {"fecha": "2022-10-05", "monto": 8000000, "estado": "A tiempo"},
            {"fecha": "2022-09-05", "monto": 9500000, "estado": "A tiempo"},
            {"fecha": "2022-08-05", "monto": 10000000, "estado": "A tiempo"},
            {"fecha": "2022-07-05", "monto": 8500000, "estado": "A tiempo"},
            {"fecha": "2022-06-05", "monto": 12000000, "estado": "A tiempo"},
            {"fecha": "2022-05-05", "monto": 9000000, "estado": "A tiempo"},
            {"fecha": "2022-04-05", "monto": 10500000, "estado": "A tiempo"},
            {"fecha": "2022-03-05", "monto": 7500000, "estado": "A tiempo"},
            {"fecha": "2022-02-05", "monto": 11000000, "estado": "A tiempo"},
            {"fecha": "2022-01-05", "monto": 8000000, "estado": "A tiempo"}
          ]
        },
        {
          "id": "CRE003",
          "tipo": "Crédito para Maquinaria",
          "entidad": "Bancoldex",
          "fecha_apertura": "2021-03-18",
          "monto_original": 320000000,
          "saldo_actual": 210000000,
          "limite_credito": 320000000,
          "tasa_interes": 0.095,
          "plazo_meses": 48,
          "estado": "Activo",
          "historial_pagos": [
            {"fecha": "2023-12-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-11-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-10-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-09-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-08-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-07-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-06-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-05-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-04-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-03-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-02-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2023-01-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-12-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-11-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-10-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-09-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-08-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-07-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-06-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-05-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-04-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-03-20", "monto": 8125000, "estado": "A tiempo"},
            {"fecha": "2022-02-20", "monto": 8125000, "estado": "Atrasado (60 días)"},
            {"fecha": "2022-01-20", "monto": 8125000, "estado": "A tiempo"}
          ]
        }
      ],
      "credito_proveedores": [
        {
          "id": "PROV001",
          "proveedor": "Hilos de Colombia S.A.",
          "terminos_pago": "30 días",
          "limite_credito": 85000000,
          "saldo_actual": 42000000,
          "historial_pagos": [
            {"fecha": "2023-12-28", "monto": 35000000, "estado": "A tiempo"},
            {"fecha": "2023-11-27", "monto": 32000000, "estado": "A tiempo"},
            {"fecha": "2023-10-29", "monto": 38000000, "estado": "A tiempo"},
            {"fecha": "2023-09-28", "monto": 30000000, "estado": "A tiempo"},
            {"fecha": "2023-08-27", "monto": 36000000, "estado": "A tiempo"},
            {"fecha": "2023-07-28", "monto": 34000000, "estado": "A tiempo"},
            {"fecha": "2023-06-27", "monto": 35000000, "estado": "A tiempo"},
            {"fecha": "2023-05-28", "monto": 31000000, "estado": "A tiempo"},
            {"fecha": "2023-04-27", "monto": 37000000, "estado": "A tiempo"},
            {"fecha": "2023-03-28", "monto": 33000000, "estado": "A tiempo"},
            {"fecha": "2023-02-27", "monto": 35000000, "estado": "A tiempo"},
            {"fecha": "2023-01-28", "monto": 36000000, "estado": "A tiempo"},
            {"fecha": "2022-12-28", "monto": 34000000, "estado": "A tiempo"},
            {"fecha": "2022-11-27", "monto": 32000000, "estado": "A tiempo"},
            {"fecha": "2022-10-29", "monto": 35000000, "estado": "A tiempo"},
            {"fecha": "2022-09-28", "monto": 33000000, "estado": "A tiempo"},
            {"fecha": "2022-08-27", "monto": 37000000, "estado": "A tiempo"},
            {"fecha": "2022-07-28", "monto": 31000000, "estado": "A tiempo"},
            {"fecha": "2022-06-27", "monto": 34000000, "estado": "A tiempo"},
            {"fecha": "2022-05-28", "monto": 36000000, "estado": "A tiempo"},
            {"fecha": "2022-04-27", "monto": 33000000, "estado": "A tiempo"},
            {"fecha": "2022-03-28", "monto": 35000000, "estado": "A tiempo"},
            {"fecha": "2022-02-27", "monto": 32000000, "estado": "Atrasado (15 días)"},
            {"fecha": "2022-01-28", "monto": 34000000, "estado": "A tiempo"}
          ]
        },
        {
          "id": "PROV002",
          "proveedor": "Telas y Fibras Ltda.",
          "terminos_pago": "45 días",
          "limite_credito": 120000000,
          "saldo_actual": 95000000,
          "historial_pagos": [
            {"fecha": "2023-12-15", "monto": 85000000, "estado": "A tiempo"},
            {"fecha": "2023-11-15", "monto": 78000000, "estado": "A tiempo"},
            {"fecha": "2023-10-15", "monto": 82000000, "estado": "A tiempo"},
            {"fecha": "2023-09-15", "monto": 75000000, "estado": "A tiempo"},
            {"fecha": "2023-08-15", "monto": 80000000, "estado": "A tiempo"},
            {"fecha": "2023-07-15", "monto": 77000000, "estado": "A tiempo"},
            {"fecha": "2023-06-15", "monto": 79000000, "estado": "A tiempo"},
            {"fecha": "2023-05-15", "monto": 81000000, "estado": "A tiempo"},
            {"fecha": "2023-04-15", "monto": 76000000, "estado": "A tiempo"},
            {"fecha": "2023-03-15", "monto": 76000000, "estado": "A tiempo"},
            {"fecha": "2023-02-15", "monto": 83000000, "estado": "A tiempo"},
            {"fecha": "2023-01-15", "monto": 79000000, "estado": "A tiempo"},
            {"fecha": "2022-12-15", "monto": 84000000, "estado": "A tiempo"},
            {"fecha": "2022-11-15", "monto": 78000000, "estado": "A tiempo"},
            {"fecha": "2022-10-15", "monto": 80000000, "estado": "A tiempo"},
            {"fecha": "2022-09-15", "monto": 81000000, "estado": "A tiempo"},
            {"fecha": "2022-08-15", "monto": 77000000, "estado": "A tiempo"},
            {"fecha": "2022-07-15", "monto": 82000000, "estado": "A tiempo"},
            {"fecha": "2022-06-15", "monto": 79000000, "estado": "A tiempo"},
            {"fecha": "2022-05-15", "monto": 80000000, "estado": "A tiempo"},
            {"fecha": "2022-04-15", "monto": 78000000, "estado": "A tiempo"},
            {"fecha": "2022-03-15", "monto": 81000000, "estado": "A tiempo"},
            {"fecha": "2022-02-15", "monto": 77000000, "estado": "A tiempo"},
            {"fecha": "2022-01-15", "monto": 84000000, "estado": "A tiempo"}
            ]
        }
        ],
        "solicitudes_credito_recientes": [
        {
            "fecha": "2023-10-05",
            "entidad": "Davivienda",
            "tipo": "Línea de Crédito",
            "monto": 200000000,
            "estado": "Aprobado"
        },
        {
            "fecha": "2023-06-12",
            "entidad": "Banco de Occidente",
            "tipo": "Préstamo para Capital de Trabajo",
            "monto": 150000000,
            "estado": "Rechazado"
        }
        ],
        "incidentes_crediticios": [
        {
            "tipo": "Pago Atrasado",
            "fecha": "2022-02-20",
            "entidad": "Bancoldex",
            "detalles": "Pago atrasado por 60 días debido a problemas administrativos internos",
            "monto": 8125000,
            "estado": "Regularizado"
        },
        {
            "tipo": "Pago Atrasado",
            "fecha": "2022-04-15",
            "entidad": "Bancolombia",
            "detalles": "Pago atrasado por 30 días debido a problemas de flujo de caja temporal",
            "monto": 9750000,
            "estado": "Regularizado"
        },
        {
            "tipo": "Pago Atrasado",
            "fecha": "2022-02-27",
            "entidad": "Hilos de Colombia S.A.",
            "detalles": "Pago atrasado por 15 días por error administrativo",
            "monto": 32000000,
            "estado": "Regularizado"
        }
        ]
    },
    "ventas_mensuales": {
        "datos_mensuales": [
        {"mes": "2023-12", "total": 485000000, "online": 145500000, "tienda": 339500000},
        {"mes": "2023-11", "total": 470000000, "online": 141000000, "tienda": 329000000},
        {"mes": "2023-10", "total": 463000000, "online": 138900000, "tienda": 324100000},
        {"mes": "2023-09", "total": 425000000, "online": 127500000, "tienda": 297500000},
        {"mes": "2023-08", "total": 415000000, "online": 124500000, "tienda": 290500000},
        {"mes": "2023-07", "total": 430000000, "online": 129000000, "tienda": 301000000},
        {"mes": "2023-06", "total": 447000000, "online": 134100000, "tienda": 312900000},
        {"mes": "2023-05", "total": 452000000, "online": 135600000, "tienda": 316400000},
        {"mes": "2023-04", "total": 438000000, "online": 131400000, "tienda": 306600000},
        {"mes": "2023-03", "total": 445000000, "online": 133500000, "tienda": 311500000},
        {"mes": "2023-02", "total": 420000000, "online": 126000000, "tienda": 294000000},
        {"mes": "2023-01", "total": 430000000, "online": 129000000, "tienda": 301000000},
        {"mes": "2022-12", "total": 465000000, "online": 139500000, "tienda": 325500000},
        {"mes": "2022-11", "total": 450000000, "online": 135000000, "tienda": 315000000},
        {"mes": "2022-10", "total": 442000000, "online": 132600000, "tienda": 309400000},
        {"mes": "2022-09", "total": 405000000, "online": 121500000, "tienda": 283500000},
        {"mes": "2022-08", "total": 400000000, "online": 120000000, "tienda": 280000000},
        {"mes": "2022-07", "total": 415000000, "online": 124500000, "tienda": 290500000},
        {"mes": "2022-06", "total": 427000000, "online": 128100000, "tienda": 298900000},
        {"mes": "2022-05", "total": 435000000, "online": 130500000, "tienda": 304500000},
        {"mes": "2022-04", "total": 420000000, "online": 126000000, "tienda": 294000000},
        {"mes": "2022-03", "total": 428000000, "online": 128400000, "tienda": 299600000},
        {"mes": "2022-02", "total": 405000000, "online": 121500000, "tienda": 283500000},
        {"mes": "2022-01", "total": 415000000, "online": 124500000, "tienda": 290500000}
        ],
        "ventas_por_categoria": [
        {"categoria": "Telas para Hogar", "porcentaje": 35},
        {"categoria": "Textiles Industriales", "porcentaje": 25},
        {"categoria": "Telas para Confección", "porcentaje": 30},
        {"categoria": "Accesorios Textiles", "porcentaje": 10}
        ],
        "metricas_ventas": {
        "ticket_promedio": 850000,
        "tasa_conversion": 0.22,
        "ciclo_venta_promedio_dias": 18,
        "costo_adquisicion_cliente": 1200000
        }
    },
    "margen_beneficio": {
        "datos_mensuales": [
        {"mes": "2023-12", "ingresos": 485000000, "costo_ventas": 291000000, "gastos_operativos": 98000000, "margen_bruto": 0.40, "margen_neto": 0.20},
        {"mes": "2023-11", "ingresos": 470000000, "costo_ventas": 282000000, "gastos_operativos": 96000000, "margen_bruto": 0.40, "margen_neto": 0.20},
        {"mes": "2023-10", "ingresos": 463000000, "costo_ventas": 277800000, "gastos_operativos": 95000000, "margen_bruto": 0.40, "margen_neto": 0.20},
        {"mes": "2023-09", "ingresos": 425000000, "costo_ventas": 255000000, "gastos_operativos": 89000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2023-08", "ingresos": 415000000, "costo_ventas": 249000000, "gastos_operativos": 87000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2023-07", "ingresos": 430000000, "costo_ventas": 258000000, "gastos_operativos": 90000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2023-06", "ingresos": 447000000, "costo_ventas": 268200000, "gastos_operativos": 94000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2023-05", "ingresos": 452000000, "costo_ventas": 271200000, "gastos_operativos": 95000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2023-04", "ingresos": 438000000, "costo_ventas": 262800000, "gastos_operativos": 92000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2023-03", "ingresos": 445000000, "costo_ventas": 267000000, "gastos_operativos": 93000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2023-02", "ingresos": 420000000, "costo_ventas": 252000000, "gastos_operativos": 88000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2023-01", "ingresos": 430000000, "costo_ventas": 258000000, "gastos_operativos": 90000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-12", "ingresos": 465000000, "costo_ventas": 279000000, "gastos_operativos": 95000000, "margen_bruto": 0.40, "margen_neto": 0.20},
        {"mes": "2022-11", "ingresos": 450000000, "costo_ventas": 270000000, "gastos_operativos": 92000000, "margen_bruto": 0.40, "margen_neto": 0.20},
        {"mes": "2022-10", "ingresos": 442000000, "costo_ventas": 265200000, "gastos_operativos": 90000000, "margen_bruto": 0.40, "margen_neto": 0.20},
        {"mes": "2022-09", "ingresos": 405000000, "costo_ventas": 243000000, "gastos_operativos": 85000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-08", "ingresos": 400000000, "costo_ventas": 240000000, "gastos_operativos": 84000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-07", "ingresos": 415000000, "costo_ventas": 249000000, "gastos_operativos": 87000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-06", "ingresos": 427000000, "costo_ventas": 256200000, "gastos_operativos": 89000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-05", "ingresos": 435000000, "costo_ventas": 261000000, "gastos_operativos": 91000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-04", "ingresos": 420000000, "costo_ventas": 252000000, "gastos_operativos": 88000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-03", "ingresos": 428000000, "costo_ventas": 256800000, "gastos_operativos": 90000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-02", "ingresos": 405000000, "costo_ventas": 243000000, "gastos_operativos": 85000000, "margen_bruto": 0.40, "margen_neto": 0.19},
        {"mes": "2022-01", "ingresos": 415000000, "costo_ventas": 249000000, "gastos_operativos": 87000000, "margen_bruto": 0.40, "margen_neto": 0.19}
        ]
    },
    "gastos": {
        "datos_mensuales": [
        {"mes": "2023-12", "total": 98000000, "fijos": 72000000, "variables": 26000000},
        {"mes": "2023-11", "total": 96000000, "fijos": 72000000, "variables": 24000000},
        {"mes": "2023-10", "total": 95000000, "fijos": 72000000, "variables": 23000000},
        {"mes": "2023-09", "total": 89000000, "fijos": 71000000, "variables": 18000000},
        {"mes": "2023-08", "total": 87000000, "fijos": 71000000, "variables": 16000000},
        {"mes": "2023-07", "total": 90000000, "fijos": 71000000, "variables": 19000000},
        {"mes": "2023-06", "total": 94000000, "fijos": 71000000, "variables": 23000000},
        {"mes": "2023-05", "total": 95000000, "fijos": 71000000, "variables": 24000000},
        {"mes": "2023-04", "total": 92000000, "fijos": 71000000, "variables": 21000000},
        {"mes": "2023-03", "total": 93000000, "fijos": 71000000, "variables": 22000000},
        {"mes": "2023-02", "total": 88000000, "fijos": 71000000, "variables": 17000000},
        {"mes": "2023-01", "total": 90000000, "fijos": 71000000, "variables": 19000000},
        {"mes": "2022-12", "total": 95000000, "fijos": 70000000, "variables": 25000000},
        {"mes": "2022-11", "total": 92000000, "fijos": 70000000, "variables": 22000000},
        {"mes": "2022-10", "total": 90000000, "fijos": 70000000, "variables": 20000000},
        {"mes": "2022-09", "total": 85000000, "fijos": 70000000, "variables": 15000000},
        {"mes": "2022-08", "total": 84000000, "fijos": 70000000, "variables": 14000000},
        {"mes": "2022-07", "total": 87000000, "fijos": 70000000, "variables": 17000000},
        {"mes": "2022-06", "total": 89000000, "fijos": 70000000, "variables": 19000000},
        {"mes": "2022-05", "total": 91000000, "fijos": 70000000, "variables": 21000000},
        {"mes": "2022-04", "total": 88000000, "fijos": 70000000, "variables": 18000000},
        {"mes": "2022-03", "total": 90000000, "fijos": 70000000, "variables": 20000000},
        {"mes": "2022-02", "total": 85000000, "fijos": 70000000, "variables": 15000000},
        {"mes": "2022-01", "total": 87000000, "fijos": 70000000, "variables": 17000000}
        ],
        "desglose_gastos": [
        {"categoria": "Salarios y Beneficios", "monto_mensual_promedio": 45000000, "porcentaje": 50.0, "tipo": "Fijo"},
        {"categoria": "Alquiler de Instalaciones", "monto_mensual_promedio": 12000000, "porcentaje": 13.3, "tipo": "Fijo"},
        {"categoria": "Servicios Públicos", "monto_mensual_promedio": 8000000, "porcentaje": 8.9, "tipo": "Variable"},
        {"categoria": "Marketing y Publicidad", "monto_mensual_promedio": 7000000, "porcentaje": 7.8, "tipo": "Variable"},
        {"categoria": "Mantenimiento de Equipos", "monto_mensual_promedio": 6000000, "porcentaje": 6.7, "tipo": "Fijo"},
        {"categoria": "Seguros", "monto_mensual_promedio": 5000000, "porcentaje": 5.6, "tipo": "Fijo"},
        {"categoria": "Transporte y Logística", "monto_mensual_promedio": 4000000, "porcentaje": 4.4, "tipo": "Variable"},
        {"categoria": "Servicios Profesionales", "monto_mensual_promedio": 3000000, "porcentaje": 3.3, "tipo": "Variable"}
        ]
    },
    "flujo_caja": {
        "datos_mensuales": [
        {"mes": "2023-12", "saldo_inicial": 187000000, "ingresos": 485000000, "egresos": 437000000, "saldo_final": 235000000},
        {"mes": "2023-11", "saldo_inicial": 165000000, "ingresos": 470000000, "egresos": 448000000, "saldo_final": 187000000},
        {"mes": "2023-10", "saldo_inicial": 158000000, "ingresos": 463000000, "egresos": 456000000, "saldo_final": 165000000},
        {"mes": "2023-09", "saldo_inicial": 153000000, "ingresos": 425000000, "egresos": 420000000, "saldo_final": 158000000},
        {"mes": "2023-08", "saldo_inicial": 145000000, "ingresos": 415000000, "egresos": 407000000, "saldo_final": 153000000},
        {"mes": "2023-07", "saldo_inicial": 132000000, "ingresos": 430000000, "egresos": 417000000, "saldo_final": 145000000},
        {"mes": "2023-06", "saldo_inicial": 120000000, "ingresos": 447000000, "egresos": 435000000, "saldo_final": 132000000},
        {"mes": "2023-05", "saldo_inicial": 108000000, "ingresos": 452000000, "egresos": 440000000, "saldo_final": 120000000},
        {"mes": "2023-04", "saldo_inicial": 95000000, "ingresos": 438000000, "egresos": 425000000, "saldo_final": 108000000},
        {"mes": "2023-03", "saldo_inicial": 82000000, "ingresos": 445000000, "egresos": 432000000, "saldo_final": 95000000},
        {"mes": "2023-02", "saldo_inicial": 78000000, "ingresos": 420000000, "egresos": 416000000, "saldo_final": 82000000},
        {"mes": "2023-01", "saldo_inicial": 75000000, "ingresos": 430000000, "egresos": 427000000, "saldo_final": 78000000},
        {"mes": "2022-12", "saldo_inicial": 70000000, "ingresos": 465000000, "egresos": 460000000, "saldo_final": 75000000},
        {"mes": "2022-11", "saldo_inicial": 68000000, "ingresos": 450000000, "egresos": 448000000, "saldo_final": 70000000},
        {"mes": "2022-10", "saldo_inicial": 65000000, "ingresos": 442000000, "egresos": 439000000, "saldo_final": 68000000},
        {"mes": "2022-09", "saldo_inicial": 62000000, "ingresos": 405000000, "egresos": 402000000, "saldo_final": 65000000},
        {"mes": "2022-08", "saldo_inicial": 60000000, "ingresos": 400000000, "egresos": 398000000, "saldo_final": 62000000},
        {"mes": "2022-07", "saldo_inicial": 58000000, "ingresos": 415000000, "egresos": 413000000, "saldo_final": 60000000},
        {"mes": "2022-06", "saldo_inicial": 55000000, "ingresos": 427000000, "egresos": 424000000, "saldo_final": 58000000},
        {"mes": "2022-05", "saldo_inicial": 52000000, "ingresos": 435000000, "egresos": 432000000, "saldo_final": 55000000},
        {"mes": "2022-04", "saldo_inicial": 50000000, "ingresos": 420000000, "egresos": 418000000, "saldo_final": 52000000},
        {"mes": "2022-03", "saldo_inicial": 48000000, "ingresos": 428000000, "egresos": 426000000, "saldo_final": 50000000},
        {"mes": "2022-02", "saldo_inicial": 45000000, "ingresos": 405000000, "egresos": 402000000, "saldo_final": 48000000},
        {"mes": "2022-01", "saldo_inicial": 42000000, "ingresos": 415000000, "egresos": 412000000, "saldo_final": 45000000}
        ]
    },
    "distribucion_ingresos": {
        "por_producto": [
        {"producto": "Telas para Decoración", "ingresos_anuales": 1960000000, "porcentaje": 21.5},
        {"producto": "Textiles para Tapicería", "ingresos_anuales": 1230000000, "porcentaje": 13.5},
        {"producto": "Telas para Confección", "ingresos_anuales": 2740000000, "porcentaje": 30.0},
        {"producto": "Telas Técnicas Industriales", "ingresos_anuales": 1640000000, "porcentaje": 18.0},
        {"producto": "Telas Ecológicas", "ingresos_anuales": 950000000, "porcentaje": 10.5},
        {"producto": "Accesorios Textiles", "ingresos_anuales": 600000000, "porcentaje": 6.5}
        ],
        "por_cliente": [
        {"tipo_cliente": "Fabricantes de Muebles", "ingresos_anuales": 2375000000, "porcentaje": 26.0},
        {"tipo_cliente": "Diseñadores de Interiores", "ingresos_anuales": 1825000000, "porcentaje": 20.0},
        {"tipo_cliente": "Fabricantes de Ropa", "ingresos_anuales": 2010000000, "porcentaje": 22.0},
        {"tipo_cliente": "Industria Automotriz", "ingresos_anuales": 1370000000, "porcentaje": 15.0},
        {"tipo_cliente": "Hoteles y Restaurantes", "ingresos_anuales": 915000000, "porcentaje": 10.0},
        {"tipo_cliente": "Otros", "ingresos_anuales": 640000000, "porcentaje": 7.0}
        ]
    },
    "gestion_ventas": {
        "objetivos": [
        {"trimestre": "2023-Q4", "objetivo": 1420000000, "logrado": 1418000000, "porcentaje_cumplimiento": 99.9},
        {"trimestre": "2023-Q3", "objetivo": 1300000000, "logrado": 1270000000, "porcentaje_cumplimiento": 97.7},
        {"trimestre": "2023-Q2", "objetivo": 1350000000, "logrado": 1337000000, "porcentaje_cumplimiento": 99.0},
        {"trimestre": "2023-Q1", "objetivo": 1280000000, "logrado": 1295000000, "porcentaje_cumplimiento": 101.2},
        {"trimestre": "2022-Q4", "objetivo": 1360000000, "logrado": 1357000000, "porcentaje_cumplimiento": 99.8},
        {"trimestre": "2022-Q3", "objetivo": 1250000000, "logrado": 1220000000, "porcentaje_cumplimiento": 97.6},
        {"trimestre": "2022-Q2", "objetivo": 1300000000, "logrado": 1282000000, "porcentaje_cumplimiento": 98.6},
        {"trimestre": "2022-Q1", "objetivo": 1240000000, "logrado": 1248000000, "porcentaje_cumplimiento": 100.6}
        ],
        "rendimiento_vendedores": [
        {"vendedor": "Carlos Ramírez", "ventas_anuales": 1820000000, "clientes_nuevos": 12, "tasa_cierre": 0.68},
        {"vendedor": "Ana María Gómez", "ventas_anuales": 1650000000, "clientes_nuevos": 15, "tasa_cierre": 0.72},
        {"vendedor": "Juan Pablo Moreno", "ventas_anuales": 1420000000, "clientes_nuevos": 10, "tasa_cierre": 0.65},
        {"vendedor": "Valentina Sánchez", "ventas_anuales": 1380000000, "clientes_nuevos": 8, "tasa_cierre": 0.70},
        {"vendedor": "Diego Herrera", "ventas_anuales": 1240000000, "clientes_nuevos": 7, "tasa_cierre": 0.63},
        {"vendedor": "Laura Ochoa", "ventas_anuales": 1150000000, "clientes_nuevos": 6, "tasa_cierre": 0.60}
        ]
    },
    "rendimiento_ventas": {
        "por_canal": [
        {"canal": "Venta Directa", "ventas_anuales": 3660000000, "porcentaje": 40.0, "crecimiento_anual": 0.08},
        {"canal": "Distribuidores", "ventas_anuales": 2750000000, "porcentaje": 30.0, "crecimiento_anual": 0.05},
        {"canal": "E-commerce", "ventas_anuales": 1830000000, "porcentaje": 20.0, "crecimiento_anual": 0.12},
        {"canal": "Exportaciones", "ventas_anuales": 915000000, "porcentaje": 10.0, "crecimiento_anual": 0.15}
        ],
        "por_region": [
        {"region": "Antioquia", "ventas_anuales": 4580000000, "porcentaje": 50.0, "crecimiento_anual": 0.07},
        {"region": "Bogotá/Cundinamarca", "ventas_anuales": 1830000000, "porcentaje": 20.0, "crecimiento_anual": 0.09},
        {"region": "Valle del Cauca", "ventas_anuales": 1375000000, "porcentaje": 15.0, "crecimiento_anual": 0.06},
        {"region": "Atlántico", "ventas_anuales": 915000000, "porcentaje": 10.0, "crecimiento_anual": 0.08},
        {"region": "Otras regiones", "ventas_anuales": 460000000, "porcentaje": 5.0, "crecimiento_anual": 0.10}
        ]
    },
    "ingresos_vs_gastos": {
        "comparativo_anual": [
        {"ano": 2023, "ingresos_totales": 5320000000, "gastos_totales": 4275000000, "beneficio_neto": 1045000000, "margen_neto": 0.196},
        {"ano": 2022, "ingresos_totales": 5112000000, "gastos_totales": 4115000000, "beneficio_neto": 997000000, "margen_neto": 0.195}
        ]
    },
    "indicadores_financieros": {
        "roi": [
        {"proyecto": "Actualización Maquinaria", "inversion": 320000000, "beneficio_neto": 98000000, "roi": 0.306, "periodo": "2021-2023"},
        {"proyecto": "E-commerce", "inversion": 85000000, "beneficio_neto": 35000000, "roi": 0.412, "periodo": "2022-2023"},
        {"proyecto": "Expansión Línea Ecológica", "inversion": 120000000, "beneficio_neto": 42000000, "roi": 0.350, "periodo": "2022-2023"},
        {"proyecto": "Optimización Logística", "inversion": 65000000, "beneficio_neto": 28000000, "roi": 0.431, "periodo": "2023"}
        ],
        "ciclo_conversion_efectivo": {
        "datos_anuales": [
            {"ano": 2023, "dio": 45, "dso": 38, "dpo": 42, "ccc": 41},
            {"ano": 2022, "dio": 48, "dso": 40, "dpo": 40, "ccc": 48}
        ]
        },
        "ratios_financieros": [
        {"ratio": "Liquidez Corriente", "valor": 1.85, "industria": 1.70, "tendencia": "Mejorando"},
        {"ratio": "Prueba Ácida", "valor": 1.35, "industria": 1.20, "tendencia": "Estable"},
        {"ratio": "Endeudamiento", "valor": 0.45, "industria": 0.50, "tendencia": "Mejorando"},
        {"ratio": "ROA", "valor": 0.14, "industria": 0.12, "tendencia": "Mejorando"},
        {"ratio": "ROE", "valor": 0.22, "industria": 0.19, "tendencia": "Estable"}
        ]
    },
    "analisis_gastos": {
        "tendencias_mensuales": {
        "2023": {
            "promedio_mensual": 91250000,
            "maximo": {"mes": "Diciembre", "valor": 98000000},
            "minimo": {"mes": "Agosto", "valor": 87000000},
            "variacion_porcentual_anual": 0.032
        },
        "2022": {
            "promedio_mensual": 88500000,
            "maximo": {"mes": "Diciembre", "valor": 95000000},
            "minimo": {"mes": "Agosto", "valor": 84000000},
            "variacion_porcentual_anual": 0.028
        }
        },
        "estacionalidad": {
        "temporada_alta": ["Octubre", "Noviembre", "Diciembre"],
        "temporada_media": ["Marzo", "Abril", "Mayo", "Junio", "Septiembre"],
        "temporada_baja": ["Enero", "Febrero", "Julio", "Agosto"]
        }
    },
    "pyme360_trust_score": {
        "calificacion_global": 82,
        "componentes": {
        "sostenibilidad": {
            "puntuacion": 78,
            "metricas": [
            {"metrica": "Eficiencia Energética", "valor": 76, "industria": 70},
            {"metrica": "Gestión de Residuos", "valor": 82, "industria": 68},
            {"metrica": "Uso Sostenible de Materiales", "valor": 75, "industria": 65}
            ],
            "iniciativas": [
            {"iniciativa": "Programa de Ahorro Energético", "estado": "Implementado", "impacto": "Reducción del 15% en consumo eléctrico"},
            {"iniciativa": "Reciclaje de Residuos Textiles", "estado": "Implementado", "impacto": "Reutilización del 45% de residuos"},
            {"iniciativa": "Línea de Textiles Ecológicos", "estado": "En expansión", "impacto": "10.5% de ventas totales"}
            ]
        },
        "cumplimiento_fiscal": {
            "puntuacion": 90,
            "metricas": [
            {"metrica": "Presentación de Declaraciones", "valor": 100, "industria": 85},
            {"metrica": "Pago de Impuestos", "valor": 98, "industria": 82},
            {"metrica": "Auditorías Fiscales", "valor": 85, "industria": 75}
            ],
            "historial": [
            {"ano": 2023, "declaraciones_tiempo": "100%", "pagos_tiempo": "100%", "auditorias": "Sin observaciones"},
            {"ano": 2022, "declaraciones_tiempo": "100%", "pagos_tiempo": "100%", "auditorias": "Observaciones menores"},
            {"ano": 2021, "declaraciones_tiempo": "100%", "pagos_tiempo": "95%", "auditorias": "Sin observaciones"}
            ]
        },
        "practicas_laborales": {
            "puntuacion": 85,
            "metricas": [
            {"metrica": "Rotación de Personal", "valor": 12, "industria": 18},
            {"metrica": "Capacitación por Empleado", "valor": 45, "industria": 35},
            {"metrica": "Incidentes Laborales", "valor": 2, "industria": 5}
            ],
            "iniciativas": [
            {"iniciativa": "Programa de Bienestar", "estado": "Implementado", "impacto": "Reducción de 20% en rotación"},
            {"iniciativa": "Capacitación Técnica", "estado": "Implementado", "impacto": "45 horas anuales por empleado"},
            {"iniciativa": "Seguridad Industrial", "estado": "Actualizado", "impacto": "Reducción de 60% en incidentes"}
            ]
        },
        "estabilidad_financiera": {
            "puntuacion": 82,
            "metricas": [
            {"metrica": "Variación de Ingresos", "valor": 5.8, "industria": 8.2},
            {"metrica": "Ratio Deuda/Patrimonio", "valor": 0.65, "industria": 0.75},
            {"metrica": "Reservas de Efectivo", "valor": 2.6, "industria": 2.0}
            ],
            "tendencias": [
            {"periodo": "2021-2023", "crecimiento_anual": "4.2%", "volatilidad": "Baja"},
            {"periodo": "2019-2021", "crecimiento_anual": "3.8%", "volatilidad": "Media-Baja"}
            ]
        },
        "puntualidad_pagos": {
            "puntuacion": 92,
            "metricas": [
            {"metrica": "Pagos a Tiempo", "valor": 97.8, "industria": 88.5},
            {"metrica": "Días Promedio de Pago", "valor": 35, "industria": 42},
            {"metrica": "Incidentes de Mora", "valor": 3, "industria": 8}
            ],
            "historial": [
            {"ano": 2023, "a_tiempo": "98.5%", "dias_promedio": 34, "incidentes": 0},
            {"ano": 2022, "a_tiempo": "97.0%", "dias_promedio": 36, "incidentes": 3},
            {"ano": 2021, "a_tiempo": "96.3%", "dias_promedio": 38, "incidentes": 4}
            ]
        },
        "innovacion": {
            "puntuacion": 75,
            "metricas": [
            {"metrica": "Inversión en I+D", "valor": 3.5, "industria": 2.8},
            {"metrica": "Nuevos Productos", "valor": 6, "industria": 5},
            {"metrica": "Adopción Tecnológica", "valor": 72, "industria": 65}
            ],
            "iniciativas": [
            {"iniciativa": "Textiles Inteligentes", "estado": "En desarrollo", "lanzamiento": "2024-Q2"},
            {"iniciativa": "Automatización de Planta", "estado": "Implementado parcialmente", "impacto": "15% reducción de costos"},
            {"iniciativa": "Plataforma Digital B2B", "estado": "Implementado", "impacto": "20% incremento en ventas online"}
            ]
        }
        },
        "historico": [
        {"trimestre": "2023-Q4", "puntuacion": 82, "variacion": 1},
        {"trimestre": "2023-Q3", "puntuacion": 81, "variacion": 2},
        {"trimestre": "2023-Q2", "puntuacion": 79, "variacion": 0},
        {"trimestre": "2023-Q1", "puntuacion": 79, "variacion": 1},
        {"trimestre": "2022-Q4", "puntuacion": 78, "variacion": 1},
        {"trimestre": "2022-Q3", "puntuacion": 77, "variacion": 1},
        {"trimestre": "2022-Q2", "puntuacion": 76, "variacion": 2},
        {"trimestre": "2022-Q1", "puntuacion": 74, "variacion": 0}
        ],
        "beneficios_obtenidos": [
        {"beneficio": "Tasa Preferencial en Préstamo", "entidad": "Bancolombia", "detalle": "Reducción de 1.2% en tasa de interés"},
        {"beneficio": "Ampliación Línea de Crédito", "entidad": "Banco de Bogotá", "detalle": "Incremento de 50M COP"},
        {"beneficio": "Alianza Comercial", "entidad": "Hotel Cadena Internacional", "detalle": "Contrato de suministro exclusivo"},
        {"beneficio": "Programa de Aceleración", "entidad": "Cámara de Comercio", "detalle": "Mentoría y networking"}
        ]
    }
}
'''
    
    # Hacer la petición a Flowise
    output = query(input_person, info_web, user_data)

    # Mostrar la respuesta
    if output:
        print(output)
    else:
        print("No se pudo obtener una respuesta de la API.")
