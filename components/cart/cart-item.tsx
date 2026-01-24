import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CartItemUI, useCartStore } from "@/store/car-store";
import { COLORS } from "../themed-color";

interface Props {
  item: CartItemUI;
}

export default function CartItem({ item }: Props) {
  const { increment, decrement, removeItem } = useCartStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      {/* IMAGE (opcional) */}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => increment(item.productId)}>
          <Ionicons name="add" size={16} />
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.quantity}</Text>

        <TouchableOpacity onPress={() => decrement(item.productId)}>
          <Ionicons name="remove" size={16} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.delete}
        onPress={() => removeItem(item.productId)}
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginVertical: 4,
  },

  price: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  actions: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  quantity: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 6,
  },

  delete: {
    marginLeft: 10,
    backgroundColor: COLORS.danger,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
