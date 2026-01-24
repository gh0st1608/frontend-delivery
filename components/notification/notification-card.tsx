// components/notification/notification-card.tsx
import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { AppNotification } from "@/hooks/notification/use-notification";

export function NotificationCard({ item }: { item: AppNotification }) {
  return (
    <View style={[styles.card, !item.read && styles.unread]}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        <ThemedText style={styles.body}>{item.body}</ThemedText>
      </View>

      <ThemedText style={styles.time}>20 min</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  unread: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  body: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  time: {
    fontSize: 10,
    opacity: 0.5,
  },
});
