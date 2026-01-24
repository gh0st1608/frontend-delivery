import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";

export function BookmarkHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#000" />
      </TouchableOpacity>

      <ThemedText type="title" style={styles.title}>
        Book Mark
      </ThemedText>

      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="bag-outline" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    borderRadius: 18,
    marginBottom: 20,

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
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});
