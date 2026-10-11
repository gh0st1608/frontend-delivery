import { Redirect, Stack } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import BottomTabBar from "@/components/navigation/bottom-tab-bar";
import { useAuth } from "@/hooks/use-auth";

export default function TabsLayout() {
  const { status } = useAuth();

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
