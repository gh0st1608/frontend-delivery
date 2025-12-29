import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/hooks/use-auth";

export default function OnboardingLayout() {
  const { status } = useAuth();
  console.log('status desde layout onboarding', status)
  // mientras se valida sesión
  if (status === "checking") return null;

  if (status !== "onboardingRequired") {
    return <Redirect href="/" />;
  }

  // ❌ NO redirecciona nada
  // Las redirecciones viven en app/index.tsx

  return <Stack screenOptions={{ headerShown: false }} />;
}
