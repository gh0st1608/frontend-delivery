// components/bookmark/bookmark-card.tsx
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Product } from "@/api/http/types/product";

export function BookmarkCard({
  product,
  onToggle,
}: {
  product: Product;
  onToggle: () => void;
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.info}>
        <ThemedText type="defaultSemiBold">{product.name}</ThemedText>
        <ThemedText style={styles.desc}>{product.description}</ThemedText>

        <View style={styles.footer}>
          <ThemedText>S/ {product.price.toFixed(2)}</ThemedText>
          <ThemedText style={styles.rating}>⭐ 4.7</ThemedText>
        </View>
      </View>

      <TouchableOpacity onPress={onToggle} style={styles.bookmark}>
        <Ionicons name="bookmark" size={18} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  desc: {
    fontSize: 12,
    opacity: 0.6,
    marginVertical: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rating: {
    fontSize: 12,
    opacity: 0.7,
  },
  bookmark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
});
