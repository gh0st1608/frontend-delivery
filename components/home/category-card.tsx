import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";

export default function CategoryCard({
  name,
  icon,
}: {
  name: string;
  icon: string;
}) {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: icon }} style={styles.image} />
      <ThemedText style={styles.text}>{name}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: 110,
  },

  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 10,
  },

  text: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
