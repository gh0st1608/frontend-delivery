import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";

export default function VerifiedConfirmScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll}>
      <ThemedView style={styles.container}>
        <Image
          source={require("@/assets/images/verified-confirm-illustration.svg")}
          style={styles.illustration}
          resizeMode="contain"
        />

        <ThemedText type="title" style={styles.title}>
          Verified!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Your email has been verified and your password updated successfully.
        </ThemedText>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/auth/login")}
        >
          <ThemedText type="defaultSemiBold" style={styles.primaryText}>
            Go to login
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/home")}
        >
          <ThemedText>Go to home</ThemedText>
        </TouchableOpacity>
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
    paddingTop: 120,
  },
  illustration: { width: 150, height: 150, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    marginTop: 16,
    width: 327,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryButton: { marginTop: 12 },
});
