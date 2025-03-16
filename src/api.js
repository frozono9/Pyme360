const BASE_URL = "http://localhost:8000";

async function testMongoConnection(testInput) {
    if (!testInput.trim()) {
        throw new Error("Por favor, introduce un valor para probar");
    }

    try {
        console.log("Sending request to:", `${BASE_URL}/api/test-connection`);
        console.log("With payload:", { testValue: testInput });
        
        const response = await fetch(`${BASE_URL}/api/test-connection`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ testValue: testInput }),
        });

        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Response data:", data);
        return data;
    } catch (error) {
        console.error("Error en testMongoConnection:", error);
        throw error; 
    }
}

async function registerUser(userData) {
  try {
    console.log("Registrando usuario:", userData.username);
    console.log("Contrasena:", userData.password);
    if (!userData.informacion_general) {
        userData.informacion_general = {};
    }
    userData.informacion_general.contrasena = userData.password;
    console.log("Datos enviados:", userData.informacion_general);
    // Eliminar la contraseña duplicada en información general
    // if (userData.informacion_general && userData.informacion_general.contrasena) {
    //   delete userData.informacion_general.contrasena;
    // }
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Intentar obtener el cuerpo como JSON, pero manejar casos donde no es JSON
    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { detail: text };
    }
    
    if (!response.ok) {
      console.error("Error en el registro:", responseData);
      throw new Error(responseData.detail || 'Error en el registro');
    }

    return responseData;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
}

async function loginUser(username, password) {
  try {
    console.log("Iniciando sesión con usuario:", username);
    // El endpoint espera un formato de formulario
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      const text = await response.text();
      responseData = { detail: text || 'Error desconocido' };
    }

    if (!response.ok) {
      console.error("Error en login:", responseData);
      throw new Error(responseData.detail || 'Credenciales incorrectas');
    }
    
    // Guardar el token en localStorage
    localStorage.setItem('token', responseData.access_token);
    return responseData;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }

    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token inválido o expirado
        localStorage.removeItem('token');
        return null;
      }
      throw new Error('Error al obtener información del usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
}

function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('pyme360-user');
}

async function uploadDataset(formData) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }
    
    const response = await fetch(`${BASE_URL}/api/dataset/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al subir el archivo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
  }
}

async function getCreditScore(directData = false) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    console.log("Solicitando Credit Score a la API...");
    const response = await fetch(`${BASE_URL}/api/credit-score${directData ? '?direct_data=true' : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Error en respuesta de credit-score:", response.status);
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al obtener puntuación crediticia');
    }

    const data = await response.json();
    console.log("Datos completos de Credit Score recibidos:", JSON.stringify(data, null, 2));
    
    // Siempre devolver datos de ejemplo (781) para pruebas/desarrollo
    // Estos datos corresponden exactamente a lo mostrado en /database
    return data;
  } catch (error) {
    console.error('Error al obtener puntuación crediticia:', error);
    throw error;
  }
}

async function getActiveDebts() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${BASE_URL}/api/active-debts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al obtener deudas activas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener deudas activas:', error);
    throw error;
  }
}

async function getTrustScore() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${BASE_URL}/api/trust-score`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al obtener PyME360 Trust Score');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener PyME360 Trust Score:', error);
    throw error;
  }
}

async function queryFinancingAssistant(question) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${BASE_URL}/api/financing-assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, input_person: "default_person" }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al consultar al asistente IA');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al consultar al asistente IA:', error);
    
    // En modo desarrollo, devolver una respuesta simulada
    if (process.env.NODE_ENV !== 'production') {
      return {
        response: `Simulación de respuesta IA para la consulta: "${question}"\n\nBasado en tu perfil financiero y necesidades específicas, te recomendaría explorar las siguientes opciones de financiamiento:\n\n1. Línea de crédito con Banco Nacional - Tasa preferencial del 12.5% anual\n2. Préstamo para PyMEs con garantía NAFIN - Hasta $1,500,000 MXN\n3. Factoraje financiero con FinCapital - Para necesidades inmediatas de flujo\n\nTu perfil muestra un excelente historial crediticio y una capacidad de pago adecuada para estos productos.`
      };
    }
    
    throw error;
  }
}

async function queryGeneralAssistant(question) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${BASE_URL}/api/general-assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al consultar al asistente IA general');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al consultar al asistente IA general:', error);
    
    // En modo desarrollo, devolver una respuesta simulada
    if (process.env.NODE_ENV !== 'production') {
      return {
        response: `Simulación de respuesta IA para la consulta: "${question}"\n\nHola, soy el asistente virtual de PyME360. ¿En qué puedo ayudarte? Si tienes preguntas sobre cualquiera de nuestros módulos o servicios, estaré encantado de asistirte. También puedo proporcionarte información general sobre la plataforma, recomendaciones personalizadas o ayudarte a resolver problemas específicos.`
      };
    }
    
    throw error;
  }
}

async function queryDocumentationAssistant(question) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${BASE_URL}/api/documentation-assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al consultar al asistente de documentación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al consultar al asistente de documentación:', error);
    
    // En modo desarrollo, devolver una respuesta simulada
    if (process.env.NODE_ENV !== 'production') {
      return {
        response: `Simulación de respuesta para la consulta: "${question}"\n\nHe analizado tu solicitud y he preparado un documento para ayudarte con tu préstamo para reformar tu tienda. Basado en tu historial financiero y los datos disponibles, he creado una propuesta de financiamiento que incluye:\n\n1. Plan de negocio con justificación de la reforma\n2. Proyección de retorno de inversión\n3. Detalle de los costos estimados\n\nPuedes descargar el documento completo usando el botón a continuación.`
      };
    }
    
    throw error;
  }
}

async function predictKpi(predictionParams) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await fetch(`${BASE_URL}/api/kpi-prediction`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(predictionParams),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al generar predicción de KPI');
    }

    const data = await response.json();
    console.log("KPI prediction data received:", data);
    return data;
  } catch (error) {
    console.error('Error al generar predicción de KPI:', error);
    
    // Manejo alternativo para entornos de desarrollo/prueba
    if (process.env.NODE_ENV !== 'production') {
      console.log("Returning fallback KPI prediction data");
      
      // Datos simulados para desarrollo
      const monthLabels = [
        "ene 2024", "feb 2024", "mar 2024", "abr 2024", "may 2024", "jun 2024", 
        "jul 2024", "ago 2024", "sept 2024", "oct 2024", "nov 2024", "dic 2024",
        "ene 2025", "feb 2025", "mar 2025", "abr 2025", "may 2025", "jun 2025", 
        "jul 2025", "ago 2025", "sept 2025", "oct 2025", "nov 2025", "dic 2025"
      ];
      
      // Generar valores simulados con crecimiento
      const initialValue = 10000;
      let currentValue = initialValue;
      const monthlyValues = [initialValue];
      const upperLimit = [initialValue * 1.1];
      const lowerLimit = [initialValue * 0.9];
      
      for (let i = 1; i < 25; i++) {
        const growth = 1 + (Math.random() * 0.08 + 0.02); // Crecimiento entre 2% y 10%
        currentValue = currentValue * growth;
        monthlyValues.push(currentValue);
        upperLimit.push(currentValue * (1 + Math.random() * 0.2));
        lowerLimit.push(currentValue * (1 - Math.random() * 0.2));
      }
      
      return {
        kpi_type: predictionParams.kpi_type,
        initial_value: initialValue,
        final_value: monthlyValues[monthlyValues.length - 1],
        monthly_values: monthlyValues,
        upper_limit: upperLimit,
        lower_limit: lowerLimit,
        total_growth_percentage: 229.4,
        monthly_growth_percentage: 9.56,
        volatility: 9.26,
        month_labels: monthLabels,
        market_events: [
          {
            mes: "may",
            año: 2025,
            descripcion: "Temporada alta"
          },
          {
            mes: "oct",
            año: 2025,
            descripcion: "Desaceleración del mercado"
          },
          {
            mes: "ene",
            año: 2026,
            descripcion: "Impulso pre-festividades"
          }
        ],
        best_month: {
          month: "dic 2025",
          growth: 25.34
        },
        worst_month: {
          month: "ene 2027",
          growth: -12.52
        },
        factors: {
          seasonality: predictionParams.include_seasonality,
          market_factors: predictionParams.include_market_factors,
          country: "México",
          sector: "Tecnología"
        },
        recommendation: "Basado en tu proyección de ingresos, es recomendable preparar tu operación para escalar rápidamente. Considera invertir en capacidad adicional y optimizar procesos para mantener la calidad durante este fuerte crecimiento. La tendencia histórica volátil sugiere preparar planes de contingencia para diferentes escenarios. Mantén reservas operativas y financieras para adaptarte a cambios bruscos.",
        confidence: "moderada"
      };
    }
    
    throw error;
  }
}

async function queryMarketTrends(question = "") {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    console.log("Solicitando análisis de tendencias a la API...");
    const response = await fetch(`${BASE_URL}/api/market-trends`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      console.error("Error en respuesta de market-trends:", response.status);
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al obtener análisis de tendencias');
    }

    const data = await response.json();
    console.log("Datos de tendencias recibidos:", data);
    return data;
  } catch (error) {
    console.error('Error al obtener análisis de tendencias:', error);
    throw error;
  }
}

export default {
  testMongoConnection,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  uploadDataset,
  getCreditScore,
  getActiveDebts,
  getTrustScore,
  queryFinancingAssistant,
  queryGeneralAssistant,
  predictKpi,
  queryDocumentationAssistant,
  queryMarketTrends
}
