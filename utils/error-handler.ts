// El backend responde los errores como { Error: { title, message, ... }, Data: null }
const getBackendMessage = (data: any): string | undefined => {
  const message = data?.Error?.message ?? data?.message;
  return Array.isArray(message) ? message.join("\n") : message;
};

// La renovación de sesión ante un 401 la resuelve el interceptor de respuesta;
// aquí solo se traduce el error a un mensaje para la UI.
export const handleApiError = async (error: any) => {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 401) {
      return new Error('Sesión expirada. Inicia sesión nuevamente.');
    }

    if (status >= 400 && status < 500) {
      return new Error(getBackendMessage(data) || 'Error en la solicitud.');
    }

    return new Error('Error interno del servidor.');
  }

  if (error.request) {
    return new Error('No se pudo conectar con el servidor.');
  }

  return new Error('Error desconocido en la solicitud.');
};
