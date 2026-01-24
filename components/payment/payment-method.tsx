import { View, Text, StyleSheet } from "react-native";
import PaymentOption from "./payment-option";
import { useCheckoutStore } from "@/store/checkout-store";

export default function PaymentMethod() {
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      <PaymentOption
        label="Paypal"
        icon={require("@/assets/icons/paypal-pay.svg")}
        selected={paymentMethod === "paypal"}
        onPress={() => setPaymentMethod("paypal")}
      />

      <PaymentOption
        label="Credit Card"
        icon={require("@/assets/icons/credit-pay.svg")}
        selected={paymentMethod === "credit-card"}
        onPress={() => setPaymentMethod("credit-card")}
      />

      <PaymentOption
        label="Apple Pay"
        icon={require("@/assets/icons/apple-pay.svg")}
        selected={paymentMethod === "apple-pay"}
        onPress={() => setPaymentMethod("apple-pay")}
      />

      <PaymentOption
        label="Google Pay"
        icon={require("@/assets/icons/google-pay.svg")}
        selected={paymentMethod === "google-pay"}
        onPress={() => setPaymentMethod("google-pay")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },
});
