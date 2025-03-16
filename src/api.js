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

// Funciones de autenticación
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

// Funciones para subir datasets
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

// Funciones para obtener datos de puntuación crediticia
async function getCreditScore() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    console.log("Solicitando Credit Score a la API...");
    const response = await fetch(`${BASE_URL}/api/credit-score`, {
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
    console.log("Datos de Credit Score recibidos:", data);
    
    // No aplicamos ninguna transformación, devolvemos exactamente lo que nos da el backend
    return data;
  } catch (error) {
    console.error('Error al obtener puntuación crediticia:', error);
    // Manejo alternativo para entornos de desarrollo/prueba
    if (process.env.NODE_ENV !== 'production') {
      console.log("Returning fallback credit score data");
      return {
        score: 720,
        components: {
          payment_history: { 
            score: 90, 
            percentage: 95,
            total_payments: 48,
            on_time_payments: 46,
            late_payments: 2,
            chart_data: [
              { month: "1/2023", "A tiempo": 3, "Atrasados": 0 },
              { month: "2/2023", "A tiempo": 4, "Atrasados": 0 },
              { month: "3/2023", "A tiempo": 3, "Atrasados": 1 },
              { month: "4/2023", "A tiempo": 4, "Atrasados": 0 },
              { month: "5/2023", "A tiempo": 4, "Atrasados": 0 },
              { month: "6/2023", "A tiempo": 3, "Atrasados": 1 }
            ]
          },
          credit_utilization: { 
            score: 85, 
            utilization: 25,
            total_debt: 25000,
            total_available: 100000,
            accounts: [
              { name: "Banco A", value: 15000, limit: 50000, utilization: 30 },
              { name: "Banco B", value: 10000, limit: 50000, utilization: 20 }
            ]
          },
          history_length: { 
            score: 80, 
            average_age: 4.5,
            num_accounts: 3,
            accounts: [
              { name: "Banco A", years: 6.2 },
              { name: "Banco B", years: 4.1 },
              { name: "Financiera C", years: 3.2 }
            ]
          },
          credit_mix: { 
            score: 90, 
            num_types: 3,
            types: ["Hipoteca", "Tarjeta de Crédito", "Préstamo Personal"],
            type_counts: [
              { name: "Hipoteca", value: 1 },
              { name: "Tarjeta de Crédito", value: 2 },
              { name: "Préstamo Personal", value: 1 }
            ]
          },
          new_applications: { 
            score: 90, 
            recent_applications: 1
          }
        },
        history: [
          { month: "Ene", score: 680 },
          { month: "Feb", score: 690 },
          { month: "Mar", score: 695 },
          { month: "Abr", score: 700 },
          { month: "May", score: 710 },
          { month: "Jun", score: 720 }
        ],
        nivel: {
          nivel: "Bueno",
          color: "bg-gradient-to-r from-sky-400 to-blue-500",
          description: "Tu puntaje está por encima del promedio, lo que te permite acceder a condiciones crediticias favorables."
        }
      };
    }
    
    throw error;
  }
}

// Función para obtener deudas activas
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

// Función para obtener PyME360 Trust Score
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

// Función para consultar al asistente IA de financiamiento
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

// Función para consultar al asistente IA general
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

// Nueva función para predecir KPIs
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
  predictKpi
}
