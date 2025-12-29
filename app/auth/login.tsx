import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const ok = await login(email, password);

      if (!ok) {
        Alert.alert("Error", "Credenciales inválidas o usuario no autorizado");
        return;
      }
      
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <ThemedView style={styles.container}>
        <Image
          source={require("@/assets/images/login-img-foodlee.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>
            Welcome
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Please login to continue
          </ThemedText>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Email
          </ThemedText>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
            <Image
              source={require("@/assets/images/login-img-icon.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Password
          </ThemedText>
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
              source={require("@/assets/images/login-img-image.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.loginText}>
              Login
            </ThemedText>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText
            type="link"
            onPress={() => router.push("/auth/forgot-password")}
          >
            Olvidaste tu contraseña?
          </ThemedText>

          <ThemedText>
            No tienes una cuenta aún?{" "}
            <ThemedText
              type="link"
              onPress={() => router.push("/auth/register")}
            >
              Registrate
            </ThemedText>
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  logo: {
    width: 118,
    height: 120,
    marginTop: 111,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
  },
  inputGroup: {
    width: 326,
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#555",
  },
  icon: {
    width: 13,
    height: 13,
  },
  loginButton: {
    marginTop: 24,
    width: 327,
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
});
