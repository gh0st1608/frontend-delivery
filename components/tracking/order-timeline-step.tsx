import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";

interface Step {
  title: string;
  time: string;
  completed: boolean;
}

interface Props {
  step: Step;
}

export function OrderTimelineStep({ step }: Props) {
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.dot,
          step.completed && styles.dotCompleted,
        ]}
      />

      <View style={styles.content}>
        <ThemedText style={styles.title}>
          {step.title}
        </ThemedText>

        <ThemedText style={styles.time}>
          {step.time}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

  content: {
    marginLeft: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
  },

  time: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
});