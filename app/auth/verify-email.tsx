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
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";

export default function VerifyEmailScreen() {
  const { verifyCode } = useAuth();
  const router = useRouter();
  const [codeMailing, setCodeMailing] = useState<string>(""); // OTP code (single string)
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!codeMailing || codeMailing.trim().length < 4) {
      Alert.alert(
        "Código inválido",
        "Por favor ingresa el código que recibiste."
      );
      return;
    }

    const ok = await verifyCode(codeMailing);

    if (!ok) {
      Alert.alert("Codigo Inválido", "El codigo no es válido.");
      return;
    }

    router.push("/create-new-password");

  };

  const handleResend = () => {
    // TODO: llamar endpoint para reenviar código
    Alert.alert("Enviado", "Se ha reenviado el código a tu correo.");
  };

  return (
    <ScrollView style={styles.scroll}>
      <ThemedView style={styles.container}>
        <Image
          source={require("@/assets/images/verify-illustration.svg")}
          style={styles.illustration}
          resizeMode="contain"
        />

        <ThemedText type="title" style={styles.title}>
          Verify your email
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter the 4-digit code sent to your email address
        </ThemedText>

        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Verification Code
          </ThemedText>

          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              placeholder="____"
              keyboardType="number-pad"
              value={codeMailing}
              onChangeText={(t) =>
                setCodeMailing(t.replace(/[^0-9]/g, "").slice(0, 6))
              }
              maxLength={6}
              placeholderTextColor="#AAA"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleVerifyCode}
          style={styles.primaryButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.primaryText}>
              Verify
            </ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} style={styles.ghostButton}>
          <ThemedText type="link">Resend code</ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText type="default" style={styles.small}>
            Didn't receive it? Check your spam folder or try again.
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  illustration: { width: 160, height: 160, marginTop: 20, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: { width: 326, marginTop: 8, marginBottom: 8 },
  label: { fontSize: 16, marginBottom: 8 },
  otpContainer: {
    width: 326,
    justifyContent: "center",
    alignItems: "center",
  },
  otpInput: {
    width: 200,
    textAlign: "center",
    fontSize: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CCC",
    color: "#111",
    letterSpacing: 10,
  },
  primaryButton: {
    marginTop: 24,
    width: 327,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  ghostButton: { marginTop: 12 },
  footer: { marginTop: 24, alignItems: "center" },
  small: { fontSize: 14, color: "#AAA", textAlign: "center" },
});
