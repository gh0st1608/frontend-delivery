import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Props {
  animatedValue?: Animated.Value;
}

export default function CartHeader({ animatedValue }: Props) {
  const Wrapper = animatedValue ? Animated.View : View;

  return (
    <Wrapper
      style={[
        styles.header,
        animatedValue && { opacity: animatedValue },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>My Cart</Text>

      <View style={{ width: 24 }} />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",

    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    // sombra Android
    elevation: 4,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
});
