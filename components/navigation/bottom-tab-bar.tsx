import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useCartStore } from "@/store/car-store";

export default function BottomTabBar() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems);

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

        {/* FAB CENTRAL - CART */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/cart")}
          activeOpacity={0.85}
        >
          <Ionicons name="bag-outline" size={26} color="#fff" />

          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalItems > 9 ? "9+" : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* NOTIFICATIONS */}
        <TabIcon
          icon="notifications-outline"
          active={isActive("/notification")}
          onPress={() => router.push("/notification")}
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
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#E53935",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
