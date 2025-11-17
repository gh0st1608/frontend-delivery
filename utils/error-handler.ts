import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

export const handleApiError = async (error: any) => {
  if (error.response) {
    const { status } = error.response;

    // Token inválido o expirado
    if (status === 401) {
      await AsyncStorage.removeItem('auth_token');
      router.replace('/auth/login');
      return new Error('Sesión expirada. Inicia sesión nuevamente.');
    }

    if (status >= 400 && status < 500) {
      return new Error(error.response.data?.message || 'Error en la solicitud.');
    }

    if (status >= 500) {
      return new Error('Error interno del servidor.');
    }
  } else if (error.request) {
    return new Error('No se pudo conectar con el servidor.');
  } else {
    return new Error('Error desconocido en la solicitud.');
  }
};
