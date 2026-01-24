import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function NotificationHeader() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Notification</Text>

      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="ellipsis-vertical" size={18} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    borderRadius: 18,

    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    // sombra Android
    elevation: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
