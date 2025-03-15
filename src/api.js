
//import { get } from "http";

const BASE_URL = "http://localhost:8000";

async function testMongoConnection(testInput) {
    if (!testInput.trim()) {
        throw new Error("Por favor, introduce un valor para probar");
    }

    try {
        const response = await fetch(BASE_URL + "/api/test-connection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ testValue: testInput }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en testMongoConnection:", error);
        throw error; 
    }
}

// Funciones de autenticación
async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    // El endpoint espera un formato de formulario
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 usa 'username' aunque enviemos email
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
      throw new Error(errorData.detail || 'Credenciales incorrectas');
    }

    const data = await response.json();
    // Guardar el token en localStorage
    localStorage.setItem('token', data.access_token);
    return data;
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
  testMongoConnection
}
