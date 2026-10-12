import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BaseHeader } from "@/components/base-header";
import { useOrderTracking } from "@/hooks/tracking/use-order-tracking";
import { ThemedText } from "@/components/themed-text";
import { DestinationCard } from "@/components/tracking/destination-card";
import { OrderTimeline } from "@/components/tracking/order-timeline";
import { TrackingWaiting } from "@/components/tracking/tracking-waiting";
import {
  isDeliveredPhase,
  isDropoffPhase,
  isPickupPhase,
} from "@/utils/tracking-phase";

type Step = {
  key: string;
  title: string;
  time: string;
  completed: boolean;
};

export function buildTimeline(phase: string, etaMinutes?: number): Step[] {
  return [
    {
      key: "order",
      title: "Order received",
      time: "Now",
      completed: true,
    },
    {
      key: "pickup",
      title: "Courier picking up order",
      time: "",
      completed:
        isPickupPhase(phase) ||
        isDropoffPhase(phase) ||
        isDeliveredPhase(phase),
    },
    {
      key: "delivery",
      title: "Courier delivering order",
      time: etaMinutes ? `${etaMinutes} min` : "",
      completed: isDropoffPhase(phase) || isDeliveredPhase(phase),
    },
    {
      key: "done",
      title: "Delivered",
      time: "",
      completed: isDeliveredPhase(phase),
    },
  ];
}

export default function TrackingOrderScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { status, tracking, confirming, confirmDelivery } =
    useOrderTracking(orderId);

  const handleConfirmDelivery = async () => {
    try {
      await confirmDelivery();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "No se pudo confirmar la entrega");
    }
  };

  // Estados de espera: misma vista (hero + barra de progreso) que la pantalla
  // de tracking, para mantener la consistencia. La línea de tiempo "Order
  // Status" se muestra en cuanto hay datos de seguimiento.
  if (!tracking) {
    return <TrackingWaiting status={status} hasLocation={false} />;
  }

  // La entrega confirmada se refleja aunque el socket aún no lo haya emitido
  const phase = status === "DELIVERED" ? "DELIVERED" : tracking.phase;
  const steps = buildTimeline(phase, tracking.eta?.etaMinutes);

  return (
    <View style={styles.container}>
      <BaseHeader
        title="Tracking Order"
      />

      <DestinationCard
        orderId={orderId}
        city={tracking.dropoff.city ?? ""}
        address={tracking.dropoff.address ?? ""}
        etaMinutes={tracking.eta?.etaMinutes ?? 0}
      />

      <ThemedText style={styles.sectionTitle}>
        Order Status
      </ThemedText>

      <OrderTimeline steps={steps} />

      {status !== "DELIVERED" && (
        <TouchableOpacity
          style={[styles.button, confirming && { opacity: 0.6 }]}
          onPress={handleConfirmDelivery}
          disabled={confirming}
        >
          {confirming ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>
              Confirm Delivery
            </ThemedText>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F6F6F6",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  button: {
    marginTop: "auto",
    backgroundColor: "#000",
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
