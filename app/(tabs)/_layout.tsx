import { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import BottomTabBar from "@/components/navigation/bottom-tab-bar";
import { useAuth } from "@/hooks/use-auth";
import { useCarts } from "@/hooks/cart/use-cart";

export default function TabsLayout() {
  const { status } = useAuth();
  const { loadCart } = useCarts();

  // 🛒 El carrito vive en backend: se sincroniza al entrar a la app
  useEffect(() => {
    if (status === "authenticated") {
      loadCart();
    }
  }, [status, loadCart]);

  if (status === "checking") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status !== "authenticated") {
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
