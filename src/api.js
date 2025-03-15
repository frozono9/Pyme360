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
    
    // Eliminar la contraseña duplicada en información general
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

    const responseData = await response.json();
    
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en login:", errorData);
      throw new Error(errorData.detail || 'Credenciales incorrectas');
    }
    
    const responseData = await response.json();
    
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

export default {
  testMongoConnection,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  uploadDataset
}
