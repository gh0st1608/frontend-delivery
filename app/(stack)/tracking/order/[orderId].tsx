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

  if (status === "WAITING") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <ThemedText>Looking for courier...</ThemedText>
      </View>
    );
  }

  if (status === "ASSIGNED") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <ThemedText>Courier assigned...</ThemedText>
      </View>
    );
  }

  if (!tracking && status === "DELIVERED") {
    return (
      <View style={styles.loader}>
        <ThemedText>Tu pedido fue entregado 🎉</ThemedText>
      </View>
    );
  }

  if (!tracking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading tracking...</ThemedText>
      </View>
    );
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

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
