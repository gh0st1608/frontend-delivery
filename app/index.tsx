import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { status } = useAuth();
  if (status === "checking") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // ❌ NO LOGUEADO
  if (status === "unauthenticated") {
    return <Redirect href="/auth/login" />;
  }

  // 🧭 ONBOARDING
  if (status === "onboardingRequired") {
    return <Redirect href="/onboarding/choose-category" />;
  }

  // 🔐 PASSWORD
  if (status === "passwordRequired") {
    return <Redirect href="/auth/create-password" />;
  }

  // ✅ LISTO
  return <Redirect href="/home" />;
}
