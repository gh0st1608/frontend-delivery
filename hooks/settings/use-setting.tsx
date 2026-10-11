// hooks/settings/use-settings.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";

export function useSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // navegación simple
  const goBack = () => router.back();

  const goToAccount = () => router.push("/profile");
  const goToBookmarks = () => router.push("/bookmark");
  // Language, FAQs, Privacy y Help aún no tienen pantalla
  const goToLanguage = undefined;
  const goToFaqs = undefined;
  const goToPrivacy = undefined;
  const goToHelp = undefined;

  const toggleNotifications = () =>
    setNotificationsEnabled((prev) => !prev);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return {
    user,
    notificationsEnabled,
    darkMode,
    goBack,
    goToAccount,
    goToLanguage,
    goToBookmarks,
    goToFaqs,
    goToPrivacy,
    goToHelp,
    toggleNotifications,
    toggleDarkMode,
    logout,
  };
}
