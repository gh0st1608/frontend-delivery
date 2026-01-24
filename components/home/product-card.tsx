import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";

type Variant = "carousel" | "grid";

export default function ProductCard({
  name,
  price,
  imageUrl,
  onPress,
  onAdd,
  variant = "carousel",
}: {
  name: string;
  price: number;
  imageUrl: string;
  onPress: () => void;
  onAdd: () => void;
  variant?: Variant;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        variant === "carousel" ? styles.carouselCard : styles.gridCard,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.info}>
        <ThemedText
          type="defaultSemiBold"
          style={styles.name}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {name}
        </ThemedText>

        <ThemedText style={styles.price}>S/ {price.toFixed(2)}</ThemedText>
      </View>

       <TouchableOpacity
        style={styles.addButton}
        onPress={onAdd}
        hitSlop={10}
      >
        <ThemedText style={styles.addText}>+</ThemedText>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160, // 🔥 fijo
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 10,
    marginRight: 14, // 🔥 separación horizontal
    elevation: 3,
  },

  /* 🔥 CARRUSEL */
  carouselCard: {
    width: 150,
    marginRight: 14,
  },

  /* 🧩 GRILLA */
  gridCard: {
    width: "48%",
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 14,
    marginBottom: 10,
  },

  info: {
    marginBottom: 10,
  },

  name: {
    fontSize: 15,
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    opacity: 0.7,
  },

  addButton: {
    backgroundColor: "#000",
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  addText: {
    color: "#FFF",
    fontSize: 20,
  },
});
