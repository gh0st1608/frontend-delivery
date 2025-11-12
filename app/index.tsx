import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  console.log("entro al index");
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  console.log('rootNavigationState',rootNavigationState)
  useEffect(() => {
    // Esperar a que el router esté inicializado
    
    if (!rootNavigationState?.key) return;

    const checkAuth = async () => {
      console.log("Verificando autenticación...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        console.log("Token encontrado, navegando a /home");
        router.replace("/home");
      } else {
        console.log("Sin token, navegando a /auth/login");
        router.replace("/auth/login");
      }
    };

    checkAuth();
  }, [rootNavigationState]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
