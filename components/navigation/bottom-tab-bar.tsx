import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

export default function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (route: string) => pathname.startsWith(route);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* HOME */}
        <TabIcon
          icon="home-outline"
          active={isActive("/home")}
          onPress={() => router.push("/home")}
        />

        {/* BOOKMARK */}
        <TabIcon
          icon="bookmark-outline"
          active={isActive("/bookmark")}
          onPress={() => router.push("/bookmark")}
        />

        {/* FAB CENTRAL */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="bag-outline" size={26} color="#fff" />
        </TouchableOpacity>

        {/* NOTIFICATIONS */}
        <TabIcon
          icon="notifications-outline"
          active={isActive("/notifications")}
          onPress={() => router.push("/notifications")}
        />

        {/* PROFILE */}
        <TabIcon
          icon="person-outline"
          active={isActive("/profile")}
          onPress={() => router.push("/profile")}
        />
      </View>
    </View>
  );
}

/* ---------------------------------- */
/* Icon Item */
/* ---------------------------------- */

function TabIcon({
  icon,
  active,
  onPress,
}: {
  icon: any;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.icon}>
      <Ionicons
        name={icon}
        size={22}
        color={active ? "#000" : "#C4C4C4"}
      />
    </TouchableOpacity>
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    width: "90%",
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 24,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  icon: {
    width: 44,
    alignItems: "center",
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
  },
});
