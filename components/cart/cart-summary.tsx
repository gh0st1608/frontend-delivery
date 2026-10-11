import { View, Text, StyleSheet } from "react-native";
import { useCartStore } from "@/store/car-store";
import { clpToUsd, formatCLP, formatUSD } from "@/utils/currency";
import { COLORS } from "../themed-color";

export default function CartSummary() {
  const { subtotal, delivery, total, usdClp } = useCartStore();
  const totalUsd = clpToUsd(total, usdClp);

  return (
    <View style={styles.container}>
      <Row label="Sub Total" value={formatCLP(subtotal)} />
      <Row label="Delivery" value={formatCLP(delivery)} />
      <Row label="Total" value={formatCLP(total)} bold />
      {/* PayPal cobra en USD: se informa el equivalente antes de pagar */}
      {total > 0 && totalUsd > 0 && (
        <Text style={styles.usdNote}>
          Se cobrará aprox. {formatUSD(totalUsd)} vía PayPal (1 USD = {formatCLP(usdClp)})
        </Text>
      )}
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

  usdNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
});

