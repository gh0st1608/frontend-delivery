import { View, FlatList, StyleSheet } from "react-native";
import { NotificationCard } from "@/components/notification/notification-card";
import { useNotifications } from "@/hooks/notification/use-notification";
import NotificationHeader from "@/components/notification/notification-header";
import { ThemedText } from "@/components/themed-text";
import { BaseHeader } from "@/components/base-header";

export default function NotificationScreen() {
  const { today, yesterday } = useNotifications();

  const data = [
    { title: "Today", data: today },
    { title: "Yesterday", data: yesterday },
  ];

  return (
    <View style={styles.container}>
      <BaseHeader title="Notification" rightIcon="ellipsis-vertical" />

      <FlatList
        data={data}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <>
            <ThemedText style={styles.section}>{item.title}</ThemedText>

            {item.data.map((notification) => (
              <NotificationCard
                key={notification.id}
                item={notification}
              />
            ))}
          </>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  section: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 12,
  },
});
