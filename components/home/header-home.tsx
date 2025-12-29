import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";

interface HeaderHomeProps {
  username: string;
  onMenuPress?: () => void; // opcional
}


export default function HeaderHome({
  username,
  onMenuPress,
}: HeaderHomeProps) {
  return (
    <View style={styles.container}>
      {/* MENU */}
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Ionicons name="menu" size={24} color="#000" />
      </TouchableOpacity>

      <View>
        <ThemedText type="title" style={styles.hello}>
          Hola, {username} 👋
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          ¿Qué quieres comer hoy?
        </ThemedText>
      </View>

      <Image
        source={require("@/assets/images/avatar.svg")}
        style={styles.avatar}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* BOTÓN MENÚ */
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    // Android shadow
    elevation: 4,
  },

  hello: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
});

