import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet } from "react-native";
import BottomTabBar from "@/components/navigation/bottom-tab-bar";

export default function AppLayout() {
  const { status } = useAuth();

  if (status === "checking") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status !== "authenticated") {
    return <Redirect href="/auth/login" />;
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
