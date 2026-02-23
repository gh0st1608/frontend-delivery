import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { usePaymentSuccess } from "@/hooks/payment/use-payment-success";

export default function PaymentSuccessScreen() {
  const { loading, orderId, confirmed } = usePaymentSuccess();
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.subtitle}>Confirming payment...</Text>
      </View>
    );
  }

  if (!confirmed) return null;

  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.duration(400)}>
        <Ionicons name="checkmark-circle" size={96} color="#22C55E" />
      </Animated.View>

      <Animated.Text entering={FadeIn.delay(200)} style={styles.title}>
        Payment Successful
      </Animated.Text>

      <Animated.Text entering={FadeIn.delay(350)} style={styles.subtitle}>
        Your order has been confirmed successfully
      </Animated.Text>

      <Animated.View entering={FadeIn.delay(500)}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.replace({ 
            pathname: "/(stack)/tracking/[orderId]",
            params: { orderId }}
          )}
        >
          <Text style={styles.primaryButtonText}>Go to Tracking</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // dark modern
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F8FAFC",
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#022C22",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
