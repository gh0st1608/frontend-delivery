import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const { status } = useAuth();
  console.log("status auth", status);
  if (status === "checking") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // 🧭 onboarding pendiente → sales de auth
  if (status === "onboardingRequired") {
    return <Redirect href="/onboarding/choose-category" />;
  }

  // ❌ Ya logueado completamente → fuera de auth
  if (status === "authenticated") {
    return <Redirect href="/(app)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
