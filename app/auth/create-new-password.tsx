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

export default function CreateNewPasswordScreen() {
  const router = useRouter();
  const { setPassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!newPassword || newPassword.length < 8) {
      Alert.alert("Error", "La contrasena debe tener al menos 8 caracteres");
      return false;
    }

    if (newPassword !== confirm) {
      Alert.alert("Error", "Las contrasenas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const ok = await setPassword(newPassword);

      if (!ok) {
        Alert.alert("Contrasena invalida", "La contrasena no es valida.");
        return;
      }

      router.replace("/auth/verified-confirm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <ThemedView style={styles.container}>
        <Image
          source={require("@/assets/images/new-password-illustration.svg")}
          style={styles.illustration}
          resizeMode="contain"
        />

        <ThemedText type="title" style={styles.title}>
          Create new password
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose a strong password to keep your account safe
        </ThemedText>

        <View style={styles.inputGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            New password
          </ThemedText>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#888"
            />
          </View>

          <ThemedText
            type="defaultSemiBold"
            style={[styles.label, { marginTop: 16 }]}
          >
            Confirm password
          </ThemedText>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.primaryButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.primaryText}>
              Save password
            </ThemedText>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText style={styles.small}>
            Your password should be at least 8 characters.
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
    paddingTop: 60,
  },
  illustration: { width: 140, height: 140, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: { width: 326, marginTop: 8 },
  label: { fontSize: 16, marginBottom: 8 },
  inputBox: {
    borderWidth: 1.5,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  input: { fontSize: 16, color: "#111" },
  primaryButton: {
    marginTop: 20,
    width: 327,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { marginTop: 18, alignItems: "center" },
  small: { fontSize: 14, color: "#AAA", textAlign: "center" },
});
