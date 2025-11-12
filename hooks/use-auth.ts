// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useRootNavigationState } from 'expo-router';

export function useAuth() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Verifica si hay token en el almacenamiento
  const checkAuth = async () => {
    try {
      console.log('entro al checkAuth')
      const token = await AsyncStorage.getItem('auth_token');
      setAuthenticated(!!token);
      return !!token;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  };

  // Ejecuta al montar el componente
  useEffect(() => {
    if (!rootNavigationState?.key) return;

    const verify = async () => {
      setLoading(true);
      const loggedIn = await checkAuth();

      // Redirige según estado
      if (loggedIn) {
        router.replace('/home');
      } else {
        router.replace('/auth/login');
      }
      setLoading(false);
    };

    verify();
  }, [rootNavigationState]);

  // Métodos de autenticación
  const login = async (token: string) => {
    await AsyncStorage.setItem('auth_token', token);
    setAuthenticated(true);
    router.replace('/(tabs)/profile');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    setAuthenticated(false);
    router.replace('/auth/login');
  };

  return { authenticated, loading, login, logout, checkAuth };
}
