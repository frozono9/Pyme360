
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
        
        let data;
        
        try {
            // Intentar parsear como JSON
            data = await response.json();
        } catch (e) {
            // Si no es JSON, obtener como texto
            const text = await response.text();
            throw new Error(`Error de respuesta: ${text}`);
        }
        
        if (!response.ok) {
            console.error("Error response:", data);
            throw new Error(`Error ${response.status}: ${data.detail || "Error desconocido"}`);
        }

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
    
    // Garantizar que no hay contraseña duplicada
    if (userData.informacion_general && userData.informacion_general.contrasena) {
      delete userData.informacion_general.contrasena;
    }
    
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Intentar obtener el cuerpo como JSON, pero manejar casos donde no es JSON
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      const text = await response.text();
      responseData = { detail: text || "Error desconocido" };
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
      console.log("Response data:", responseData);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      const text = await response.text();
      console.error("Raw response:", text);
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

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
}

function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('pyme360-user');
}

// Funciones para obtener scores
async function getCreditScore() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }
    
    const response = await fetch(`${BASE_URL}/api/scores/credit`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al obtener credit score');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener credit score:', error);
    throw error;
  }
}

async function getTrustScore() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }
    
    const response = await fetch(`${BASE_URL}/api/scores/trust`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al obtener trust score');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener trust score:', error);
    throw error;
  }
}

async function updateScores() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Usuario no autenticado');
    }
    
    const response = await fetch(`${BASE_URL}/api/scores/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al actualizar scores');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar scores:', error);
    throw error;
  }
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

export default {
  testMongoConnection,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  uploadDataset,
  getCreditScore,
  getTrustScore,
  updateScores
}
