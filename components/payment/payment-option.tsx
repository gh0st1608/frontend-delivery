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
  disabled?: boolean;
  onPress: () => void;
}

export default function PaymentOption({
  label,
  icon,
  selected,
  disabled = false,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.active, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Image source={icon} style={styles.icon} />
        <View>
          <Text style={styles.label}>{label}</Text>
          {disabled && <Text style={styles.soon}>Próximamente</Text>}
        </View>
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

  disabled: {
    opacity: 0.5,
  },

  soon: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
