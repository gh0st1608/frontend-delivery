import { View, Text, StyleSheet } from "react-native";
import { useCartStore } from "@/store/car-store";
import { COLORS } from "../themed-color";

export default function CartSummary() {
  const { subtotal, delivery, total } = useCartStore();

  return (
    <View style={styles.container}>
      <Row label="Sub Total" value={`$${subtotal.toFixed(2)}`} />
      <Row label="Free & Delivery" value={`$${delivery.toFixed(2)}`} />
      <Row label="Total" value={`$${total.toFixed(2)}`} bold />
    </View>
  );
}

function Row({ label, value, bold }: any) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.value, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  value: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  bold: {
    fontWeight: "700",
    fontSize: 16,
  },
});

