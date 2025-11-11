import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Link, useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    console.log('Register:', { fullName, email, password, confirmPassword });
    router.push('/(tabs)');
  };

  return (
    <ScrollView style={styles.scroll}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Create an account
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Please sign up to your account
          </ThemedText>
        </View>

        {/* Full name */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Full Name
          </ThemedText>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Braxton Stark"
              placeholderTextColor="#aaa"
              value={fullName}
              onChangeText={setFullName}
            />
            <Image
              source={require('@/assets/images/register-img-icon-2.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Email
          </ThemedText>
          <TextInput
            style={[styles.input, styles.inputField]}
            placeholder="braxtonstark@gmail.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Password
          </ThemedText>
          <TextInput
            style={[styles.input, styles.inputField]}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Confirm password */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Confirm Password
          </ThemedText>
          <TextInput
            style={[styles.input, styles.inputField]}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <View style={styles.checkbox} />
          <ThemedText style={styles.termsText}>
            By creating an account you agree with our terms & conditions.
          </ThemedText>
        </View>

        {/* Button */}
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Sign Up
          </ThemedText>
        </TouchableOpacity>

        {/* Go to login */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Already have an account?{' '}
            <Link href="/register" style={styles.loginLink}>
              Log in
            </Link>
          </ThemedText>
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
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginTop: 6,
  },
  inputGroup: {
    marginTop: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 3,
  },
  termsText: {
    color: '#777',
    fontSize: 13,
    flex: 1,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#555',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: '600',
  },
});
