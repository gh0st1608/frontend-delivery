import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function PaymentFailure() {
  const shakeX = useSharedValue(0);

  useEffect(() => {
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Shake animation
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }, []);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={shakeStyle}>
        <Ionicons
          name="close-circle"
          size={96}
          color="#EF4444"
        />
      </Animated.View>

      <Animated.Text
        entering={FadeIn.delay(200)}
        style={styles.title}
      >
        Payment Failed
      </Animated.Text>

      <Animated.Text
        entering={FadeIn.delay(350)}
        style={styles.subtitle}
      >
        Something went wrong. Please try again.
      </Animated.Text>

      <Animated.View entering={FadeIn.delay(500)}>
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // dark modern
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F8FAFC",
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#022C22",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
