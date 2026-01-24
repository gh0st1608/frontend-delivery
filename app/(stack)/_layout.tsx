import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ActivityIndicator, View } from "react-native";

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

  return <Stack screenOptions={{ headerShown: false }} />;
}
