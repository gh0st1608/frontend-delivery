import { Stack, useSegments } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const segments = useSegments();

  useEffect(() => {
    console.log("🗺️ Rutas detectadas por Expo Router:", segments);
  }, [segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="home" />
    </Stack>
  );
}
