import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomTabBar from "@/components/navigation/bottom-tab-bar";

export default function TabsLayout() {
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
