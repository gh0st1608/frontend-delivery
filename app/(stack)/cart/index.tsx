import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useCartStore } from "@/store/car-store";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import PromoCode from "@/components/cart/promo-code";
import CartHeader from "@/components/cart/cart-header";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { BaseHeader } from "@/components/base-header";
import { useCarts } from "@/hooks/cart/use-cart";

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const { loadCart, loading } = useCarts();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDisabled = items.length === 0;

  // Sincroniza con el carrito guardado en backend
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <BaseHeader title="My Cart" />

      {/* Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadCart}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          )
        }
      />

      <PromoCode />
      <CartSummary />

      {/* Checkout */}
      <TouchableOpacity
        style={[styles.checkoutButton, isDisabled && { opacity: 0.5 }]}
        activeOpacity={0.9}
        disabled={isDisabled}
        onPress={() => router.push("/checkout")}
      >
        <Text style={styles.checkoutText}>Checkout</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 180, // espacio para summary + button
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
    fontSize: 15,
  },

  checkoutButton: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
