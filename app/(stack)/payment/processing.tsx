import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function PaymentProcessing() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Processing your payment...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
