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

    const response = await fetch(`${BASE_URL}/api/credit-score`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al obtener puntuación crediticia');
    }

    const data = await response.json();
    console.log("Credit score data received:", data);
    return data;
  } catch (error) {
    console.error('Error al obtener puntuación crediticia:', error);
    // Manejo alternativo para entornos de desarrollo/prueba
    if (process.env.NODE_ENV !== 'production') {
      console.log("Returning fallback credit score data");
      return {
        score: 720,
        components: {
          payment_history: { percentage: 95, score: 90 },
          credit_utilization: { utilization: 25, score: 85 },
          history_length: { averageAge: 4.5, score: 80 },
          credit_mix: { numTypes: 3, score: 90 },
          new_applications: { numIncidents: 1, score: 90 }
        },
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
      body: JSON.stringify({ question }),
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
  queryFinancingAssistant
}
