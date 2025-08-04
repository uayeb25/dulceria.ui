// Configuración base de la API
const API_BASE_URL = 'https://dulceria-api-production.up.railway.app';

// Configuración base para las peticiones
const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función helper para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Manejar diferentes códigos de estado
    switch (response.status) {
      case 400:
        // Error de validación o usuario ya existe
        throw new Error(errorData.message || 'Este email ya está registrado. Intenta con otro email.');
      case 401:
        throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
      case 403:
        throw new Error('No tienes permisos para realizar esta acción.');
      case 404:
        throw new Error('El recurso solicitado no fue encontrado.');
      case 409:
        throw new Error('El usuario ya existe en el sistema.');
      case 500:
        throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
      default:
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

export { API_BASE_URL, handleResponse };
