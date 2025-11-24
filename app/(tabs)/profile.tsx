import { View, Button } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
