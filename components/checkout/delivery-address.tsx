import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCheckoutStore } from "@/store/checkout-store";
import { MapPicker } from "@/components/tracking/map-picker";
import { useState } from "react";

const C = {
  bg: "#F5F5F5",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  accent: "#22C55E",
  accentSoft: "#F0FDF4",
  border: "#EDEDED",
};

export default function DeliveryAddress() {
  const { address, updateAddressFromCoordinates, loadingAddress } =
    useCheckoutStore();

  const [visible, setVisible] = useState(false);
  const hasSelection = !!address.lat && !!address.lng;

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Delivery Address</Text>

        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="location-outline" size={18} color={C.text} />
          </View>

          <View style={styles.info}>
            <Text style={styles.city} numberOfLines={1}>
              {loadingAddress ? "Cargando ubicación..." : address.city}
            </Text>
            <Text style={styles.street} numberOfLines={1}>
              {address.street}
            </Text>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={() => setVisible(true)}>
            <Ionicons name="pencil" size={16} color={C.text} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Dirección de entrega</Text>
              <Text style={styles.sheetSubtitle}>
                Busca o ajusta el punto en el mapa
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" size={20} color={C.text} />
            </TouchableOpacity>
          </View>

          {/* Mapa + buscador */}
          <View style={styles.pickerArea}>
            <MapPicker
              lat={address.lat}
              lng={address.lng}
              onSelect={async (lat, lng) => {
                await updateAddressFromCoordinates(lat, lng);
              }}
            />
          </View>

          {/* Dirección seleccionada + confirmar */}
          <View style={styles.bottomCard}>
            <View style={styles.selectedRow}>
              <View style={styles.pinWrap}>
                <Ionicons name="location-sharp" size={18} color={C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                {loadingAddress ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={C.muted} />
                    <Text style={styles.selStreet}>Obteniendo dirección…</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.selCity} numberOfLines={1}>
                      {hasSelection ? address.city || "Punto seleccionado" : "Selecciona un punto"}
                    </Text>
                    <Text style={styles.selStreet} numberOfLines={1}>
                      {address.street}
                    </Text>
                  </>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, !hasSelection && styles.confirmDisabled]}
              disabled={!hasSelection}
              onPress={() => setVisible(false)}
              activeOpacity={0.9}
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.confirmText}>Confirmar ubicación</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 36 },

  title: { fontSize: 16, fontWeight: "700", marginBottom: 14, color: C.text },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
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

  info: { flex: 1 },
  city: { fontSize: 14, fontWeight: "600", color: C.text },
  street: { fontSize: 13, color: C.muted, marginTop: 4 },

  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
  },

  // ---- Modal / sheet ----
  sheet: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: C.text },
  sheetSubtitle: { fontSize: 13, color: C.muted, marginTop: 2 },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },

  pickerArea: { flex: 1, minHeight: 0 },

  bottomCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
  },

  selectedRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  pinWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  selCity: { fontSize: 15, fontWeight: "700", color: C.text },
  selStreet: { fontSize: 13, color: C.muted, marginTop: 3 },

  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 16,
  },
  confirmDisabled: { opacity: 0.4 },
  confirmText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
