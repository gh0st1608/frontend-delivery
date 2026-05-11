import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";

interface Courier {
  id: string;
  name: string;
}

interface Props {
  courier: Courier;
  onCallPress?: () => void;
  onChatPress?: () => void;
}

export function CourierCard({
  courier,
  onCallPress,
  onChatPress,
}: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: "https://goo.su/914zCnu" }}
        style={styles.avatar}
      />

      <View style={styles.info}>
        <ThemedText style={styles.name}>
          {courier.name}
        </ThemedText>

        <ThemedText style={styles.id}>
          ID - {courier.id}
        </ThemedText>

        <ThemedText style={styles.role}>
          Food Courier
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onChatPress}>
          <ThemedText>💬</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onCallPress}>
          <ThemedText>📞</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  id: {
    color: "#BBB",
    fontSize: 12,
    marginTop: 2,
  },

  role: {
    color: "#FFF",
    fontSize: 13,
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});