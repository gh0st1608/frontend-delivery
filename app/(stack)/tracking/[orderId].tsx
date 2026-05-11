import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BaseHeader } from "@/components/base-header";
import { MapRoute } from "@/components/tracking/map-route";
import { CourierCard } from "@/components/tracking/courier-card";
import { useOrderTracking } from "@/hooks/tracking/use-order-tracking";
import { ThemedText } from "@/components/themed-text";
import { DestinationCard } from "@/components/tracking/destination-card";

export default function TrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { status, tracking, routeCoordinates } = useOrderTracking(orderId);

  // 🔵 WAITING
  if (status === "WAITING") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <ThemedText>Looking for courier...</ThemedText>
      </View>
    );
  }

  // 🟢 ASSIGNED
  if (status === "ASSIGNED") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <ThemedText>Courier assigned. Getting location...</ThemedText>
      </View>
    );
  }

  // 🚀 TRACKING
  if (!tracking) return null;
  console.log("tracking", tracking);
  return (
    <View style={styles.container}>
      <BaseHeader title="Tracking" />

      <View style={styles.mapContainer}>
        <MapRoute
          courier={tracking.location}
          pickup={tracking.pickup}
          dropoff={tracking.dropoff}
          phase={tracking.phase}
          route={routeCoordinates}
        />
      </View>

      <View style={styles.bottomContainer}>
        <CourierCard
          courier={tracking.courier}
        />
        <DestinationCard
          orderId={orderId}
          city={tracking.dropoff.city}
          address={tracking.dropoff.address}
          etaMinutes={tracking.eta.etaMinutes}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  mapContainer: {
    height: 320,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  waitingText: {
    fontSize: 14,
    color: "#666",
  },

  bottomContainer: {
    padding: 16,
    gap: 12,
  },

  etaCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  location: {
    fontSize: 14,
    fontWeight: "700",
  },

  address: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  eta: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
