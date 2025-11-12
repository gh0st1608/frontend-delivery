import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Aquí normalmente harías un fetch a tu backend
    if (email && password) {
      // Simula token devuelto por el backend
      const fakeToken = 'token12345';
      await login(fakeToken);
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <ThemedView style={styles.container}>
        {/* Logo */}
        <Image
          source={require('@/assets/images/login-img-foodlee.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Texto principal */}
        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>Welcome</ThemedText>
          <ThemedText style={styles.subtitle}>
            Please login or sign up to continue our app
          </ThemedText>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>Email</ThemedText>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="braxtonstark@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
            <Image
              source={require('@/assets/images/login-img-icon.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>Password</ThemedText>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#888"
            />
            <Image
              source={require('@/assets/images/login-img-image.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Botón de Login */}
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <ThemedText type="defaultSemiBold" style={styles.loginText}>Login</ThemedText>
        </TouchableOpacity>

        {/* Texto inferior */}
        <View style={styles.footer}>
          <ThemedText>Forgot your password?</ThemedText>
          {/* <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.signUpLink}>
            <ThemedText type="link">Don’t have an account? Sign up</ThemedText>
          </TouchableOpacity> */}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  logo: {
    width: 118,
    height: 120,
    marginTop: 111,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  inputGroup: {
    width: 326,
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  icon: {
    width: 13,
    height: 13,
  },
  loginButton: {
    marginTop: 24,
    width: 327,
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  signUpLink: {
    marginTop: 12,
  },
});