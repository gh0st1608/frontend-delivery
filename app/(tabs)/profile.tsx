import { View, Button } from 'react-native';
import { useAuth } from '@/hooks/use-auth';

export default function ProfileScreen() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
