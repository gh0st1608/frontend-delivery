import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { status } = useAuth();
  console.log("status index", status);
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
    console.log("entro al route de onboardingRequired de index app");
    return <Redirect href="/onboarding/choose-category" />;
  }

  // 🔐 PASSWORD
  if (status === "passwordRequired") {
    return <Redirect href="/auth/create-password" />;
  }

  // ✅ LISTO
  return <Redirect href="/(app)/home" />;
}
