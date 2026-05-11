import { View, StyleSheet } from "react-native";
import { OrderTimelineStep } from "@/components/tracking/order-timeline-step";

interface Step {
  key: string;
  title: string;
  time: string;
  completed: boolean;
}

interface Props {
  steps: Step[];
}

export function OrderTimeline({ steps }: Props) {
  return (
    <View style={styles.timeline}>
      {steps.map((step) => (
        <OrderTimelineStep key={step.key} step={step} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  timeline: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
  },
});