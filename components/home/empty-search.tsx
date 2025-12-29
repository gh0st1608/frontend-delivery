import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";

export default function EmptySearch() {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        No results found
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Try searching with another keyword
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 48,          // baja el empty debajo del search
    paddingHorizontal: 40,  // mismo aire visual que Figma
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    opacity: 0.6,
  },
});
