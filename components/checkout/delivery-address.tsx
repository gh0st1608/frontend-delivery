import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCheckoutStore } from "@/store/checkout-store";
import { MapPicker } from "@/components/tracking/map-picker";
import { useState } from "react";

export default function DeliveryAddress() {
  const { address, updateAddressFromCoordinates, loadingAddress } =
    useCheckoutStore();

  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Delivery Address</Text>

        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="location-outline" size={18} />
          </View>

          <View style={styles.info}>
            <Text style={styles.city}>
              {loadingAddress ? "Loading location..." : address.city}
            </Text>
            <Text style={styles.street}>{address.street}</Text>
          </View>

          <TouchableOpacity onPress={() => setVisible(true)}>
            <Ionicons name="pencil-outline" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={visible} animationType="slide">
        <MapPicker
          lat={address.lat}
          lng={address.lng}
          onSelect={async (lat, lng) => {
            await updateAddressFromCoordinates(lat, lng);
          }}
        />

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setVisible(false)}
        >
          <Text style={{ color: "white" }}>Confirm Location</Text>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 36,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  city: {
    fontSize: 14,
    fontWeight: "600",
  },

  street: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  confirmButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "black",
    padding: 16,
    borderRadius: 12,
  },
});
