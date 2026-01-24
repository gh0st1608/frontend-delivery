import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import PaymentMethod from "@/components/payment/payment-method";
import DeliveryAddress from "@/components/checkout/delivery-address";
import { BaseHeader } from "@/components/base-header";
import { useCheckoutFlow } from "@/hooks/checkout/use-checkout-flow";

export default function CheckoutScreen() {
  const { startCheckout, loading } = useCheckoutFlow();

  return (
    <View style={styles.container}>
      <BaseHeader title="Checkout" rightIcon="bag-outline" />

      <PaymentMethod />
      <DeliveryAddress />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={startCheckout}
        disabled={loading}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Pay now"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6F6F6",
  },

  button: {
    backgroundColor: "#000",
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
   buttonDisabled: {
    opacity: 0.6,
  },
});
