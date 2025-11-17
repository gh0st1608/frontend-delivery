import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const { verifyEmail } = useAuth();
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleVerifyEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa un correo válido.");
      return;
    }

    const ok = await verifyEmail(email);

    if (!ok) {
      Alert.alert(
        "Correo inválido",
        "El email no está registrado o no es válido."
      );
      return;
    }

    router.push("/verify-email");
  };

  return (
    <ScrollView style={styles.scroll}>
      <ThemedView style={styles.container}>
        {/* Header con flecha */}
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuBar}
            onPress={() => router.back()}
          >
            <Image
              source={require("@/assets/images/forgot-password-img-arrow-left.svg")}
              style={styles.arrow}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              Forgot Password
            </ThemedText>
          </View>
        </View>
        {/* Ilustración */}

        {/* Texto descriptivo */}
        <View style={styles.textBox}>
          <Image
            source={require("@/assets/images/forgot-password-img-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
          <ThemedText style={styles.description}>
            Please enter your email address to receive a verification code.
          </ThemedText>
        </View>

        {/* Input */}
        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Email
          </ThemedText>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor="#AAA"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Try another way */}
        <TouchableOpacity onPress={() => console.log("try another way")}>
          <ThemedText type="link" style={styles.tryAnother}>
            Try another way
          </ThemedText>
        </TouchableOpacity>

        {/* Botón */}
        <TouchableOpacity style={styles.sendButton} onPress={handleVerifyEmail}>
          <ThemedText type="defaultSemiBold" style={styles.sendText}>
            Send
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  illustration: {
    width: 163,
    height: 163,
    marginTop: -200,
  },
  menu: {
    flexDirection: "row",
    alignItems: "center",
    gap: 46,
    marginTop: 120,
    alignSelf: "flex-start",
  },
  menuBar: {
    width: 40,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  arrow: {
    width: 18,
    height: 12,
  },
  titleContainer: {
    height: 23,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  textBox: {
    marginTop: 300,
    width: 300,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#AAA",
    lineHeight: 22,
  },

  inputGroup: {
    width: 326,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputBox: {
    borderWidth: 1.5,
    borderColor: "#CCC",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
  },
  input: {
    fontSize: 16,
    color: "#555",
  },

  tryAnother: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },

  sendButton: {
    width: 327,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 80,
  },
  sendText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "700",
  },
});
