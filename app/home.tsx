// app/home.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('auth_token');
      setToken(storedToken);
    };
    loadToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('auth_token');
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 🎉</Text>
      <Text style={styles.subtitle}>Token actual:</Text>
      <Text style={styles.token}>{token}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
  },
  token: {
    fontSize: 12,
    marginVertical: 10,
    color: '#555',
  },
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
