import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BaseHeader } from "@/components/base-header";
import { useOrderTracking } from "@/hooks/tracking/use-order-tracking";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";

export default function TrackingOrderScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data, loading } = useOrderTracking(orderId);

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
        title="Tracking Order"
        rightIcon="arrow-back"
        onRightPress={() => router.back()}
      />

      {/* 📍 Address */}
      <View style={styles.addressCard}>
        <Ionicons name="location-outline" size={20} />
        <View style={{ marginLeft: 10 }}>
          <ThemedText style={styles.location}>
            Los Angeles / California
          </ThemedText>
          <ThemedText style={styles.address}>
            3252 Hillhaven Drive
          </ThemedText>
        </View>

        <ThemedText style={styles.eta}>
          15–20 min
        </ThemedText>
      </View>

      {/* 📦 Status */}
      <ThemedText style={styles.sectionTitle}>
        Order Status
      </ThemedText>

      <View style={styles.timeline}>
        {data.steps.map((step: any, index: number) => (
          <View key={step.key} style={styles.step}>
            <View
              style={[
                styles.dot,
                step.completed && styles.dotCompleted,
              ]}
            />

            <View style={styles.stepContent}>
              <ThemedText style={styles.stepTitle}>
                {step.title}
              </ThemedText>
              <ThemedText style={styles.stepTime}>
                {step.time}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* ✅ CTA */}
      <TouchableOpacity style={styles.button}>
        <ThemedText style={styles.buttonText}>
          Confirm Delivery
        </ThemedText>
      </TouchableOpacity>
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

  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  location: {
    fontSize: 14,
    fontWeight: "700",
  },

  address: {
    fontSize: 13,
    color: "#666",
  },

  eta: {
    marginLeft: "auto",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  timeline: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
  },

  step: {
    flexDirection: "row",
    marginBottom: 16,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CCC",
    marginTop: 6,
  },

  dotCompleted: {
    backgroundColor: "#000",
  },

  stepContent: {
    marginLeft: 12,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  stepTime: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
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
