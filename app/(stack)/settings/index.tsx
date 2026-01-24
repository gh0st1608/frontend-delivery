import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "@/hooks/settings/use-setting";

export default function SettingsScreen() {
  const {
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
  } = useSettings();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          {/* <ArrowLeft width={40} height={40} /> */}
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.userCard}>
        <Image
          source={{ uri: user?.image || "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />

        {/* INFO */}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#E53935" />
        </TouchableOpacity>
      </View>

      {/* Options */}
      <View style={styles.section}>
        <Option label="Account" onPress={goToAccount} />
        <Option label="Language" value="English" onPress={goToLanguage} />
        <SwitchOption
          label="Notification"
          value={notificationsEnabled}
          onChange={toggleNotifications}
        />
        <SwitchOption
          label="Dark Mood"
          value={darkMode}
          onChange={toggleDarkMode}
        />
        <Option label="Book Mark" onPress={goToBookmarks} />
      </View>

      <View style={styles.section}>
        <Option label="FAQs" onPress={goToFaqs} />
        <Option label="Privacy policy" onPress={goToPrivacy} />
        <Option label="Help Community" onPress={goToHelp} />
      </View>
    </View>
  );
}

/* ---------------------------------- */
/* Reusable Components */
/* ---------------------------------- */

function Option({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Text style={styles.optionText}>{label}</Text>
      <Text style={styles.optionValue}>{value ?? "›"}</Text>
    </TouchableOpacity>
  );
}

function SwitchOption({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <View style={styles.option}>
      <Text style={styles.optionText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },

  userInfo: {
    flex: 1, // 🔥 CLAVE
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  email: {
    fontSize: 12,
    color: "#777",
  },

  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "600",
  },

  section: {
    backgroundColor: "#F9F9F9",
    borderRadius: 14,
    marginBottom: 20,
    paddingVertical: 8,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },

  optionValue: {
    fontSize: 14,
    color: "#999",
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    // shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    // shadow Android
    elevation: 4,

    marginRight: 12,
  },
});
