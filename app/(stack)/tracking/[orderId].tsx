import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BaseHeader } from "@/components/base-header";
import { MapRoute } from "@/components/tracking/map-route.web";
import { CourierCard } from "@/components/tracking/courier-card";
import { useCourierTracking } from "@/hooks/tracking/use-courier-tracking";
import { ThemedText } from "@/components/themed-text";

export default function TrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data, loading } = useCourierTracking(orderId);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={styles.container}>
      <BaseHeader
        title="Tracking"
        rightIcon="arrow-back"
        onRightPress={() => router.back()}
      />

      {/* 🗺️ Map */}
      <View style={styles.mapContainer}>
        <MapRoute
          courier={data.location}
          destination={data.destination}
        />
      </View>

      {/* 📦 Bottom Card */}
      <View style={styles.bottomContainer}>
        <CourierCard courier={data.courier}
        etaMinutes={data.etaMinutes} 
        />

        <View style={styles.etaCard}>
          <ThemedText style={styles.location}>
            Los Angeles / California
          </ThemedText>

          <ThemedText style={styles.address}>
            3252 Hillhaven Drive
          </ThemedText>

          <ThemedText style={styles.eta}>
            Arrive time {data.etaMinutes} min
          </ThemedText>
        </View>
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
    flex: 1,
    minHeight: 300,          // 👈 CRÍTICO para web
    backgroundColor: "#EEE",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
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
