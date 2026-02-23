import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/themed-text";

interface Courier {
  id: string;
  name: string;
}

interface Props {
  courier: Courier;
  etaMinutes: number;
  onCallPress?: () => void;
}

export function CourierCard({
  courier,
  etaMinutes,
  onCallPress,
}: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://goo.su/914zCnu' }}
        style={styles.avatar}
      />

      <View style={styles.info}>
        <ThemedText style={styles.name}>
          {courier.name}
        </ThemedText>
        <ThemedText style={styles.role}>
          {courier.id}
        </ThemedText>

        <ThemedText style={styles.eta}>
          Arrive time {etaMinutes} min
        </ThemedText>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={onCallPress}
      >
        <ThemedText style={styles.callText}>📞</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  role: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  eta: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },

  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  callText: {
    color: "#FFF",
    fontSize: 16,
  },
});
