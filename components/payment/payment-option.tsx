import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  label: string;
  icon: any;
  selected: boolean;
  onPress: () => void;
}

export default function PaymentOption({
  label,
  icon,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.active]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>

      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        size={20}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },

  active: {
    borderWidth: 1,
    borderColor: "#000",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
  },
});
