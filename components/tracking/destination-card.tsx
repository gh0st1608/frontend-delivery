import { View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  orderId: string;
  city: string;
  address: string;
  etaMinutes: number;
};

export function DestinationCard({ orderId, city, address, etaMinutes }: Props) {
  const handleOpenOrder = () => {
      router.push(`/tracking/order/${orderId}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleOpenOrder}>
      <Ionicons name="location-outline" size={20} />
      <View>
        <ThemedText style={styles.city}>{city}</ThemedText>
        <ThemedText style={styles.address}>{address}</ThemedText>
      </View>

      <ThemedText style={styles.eta}>{etaMinutes} min</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  city: {
    fontSize: 14,
    fontWeight: "700",
  },

  address: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  eta: {
    fontSize: 14,
    fontWeight: "700",
  },
});
