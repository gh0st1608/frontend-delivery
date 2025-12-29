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
  const goToLanguage = () => router.push("/settings/language");
  const goToBookmarks = () => router.push("/bookmarks");
  const goToFaqs = () => router.push("/faqs");
  const goToPrivacy = () => router.push("/privacy");
  const goToHelp = () => router.push("/help");

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
