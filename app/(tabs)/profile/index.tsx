import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks/profile/use-profile";

export default function ProfileScreen() {
  const { user, posts, activeTab, goBack, changeTab } = useProfile();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* COVER */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: user.cover }} style={styles.cover} />

        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* AVATAR */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.camera}>
          <Ionicons name="camera" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      {/* SOCIAL */}
      <View style={styles.socialRow}>
        <Social icon="logo-facebook" />
        <Social icon="logo-instagram" />
        <Social icon="logo-linkedin" />
      </View>

      {/* STATS */}
      <View style={styles.stats}>
        <Stat label="Post" value={user.stats.posts} />
        <Stat label="Following" value={user.stats.following} />
        <Stat label="Followers" value={user.stats.followers} />
        <Stat
          label="Review"
          value={`${user.stats.rating}`}
          extra={`⭐ ${user.stats.reviews}`}
        />
      </View>

      {/* FOLLOW */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <Tab
          label="Post"
          active={activeTab === "post"}
          onPress={() => changeTab("post")}
        />
        <Tab
          label="Videos"
          active={activeTab === "videos"}
          onPress={() => changeTab("videos")}
        />
        <Tab
          label="Book Mark"
          active={activeTab === "bookmark"}
          onPress={() => changeTab("bookmark")}
        />
      </View>

      {/* GRID */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.post} />
        )}
      />
    </ScrollView>
  );
}

/* ---------------------------------- */
/* Small Components */
/* ---------------------------------- */

function Social({ icon }: { icon: any }) {
  return (
    <TouchableOpacity style={styles.social}>
      <Ionicons name={icon} size={18} />
    </TouchableOpacity>
  );
}

function Stat({
  label,
  value,
  extra,
}: {
  label: string;
  value: number | string;
  extra?: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      {extra && <Text style={styles.statExtra}>{extra}</Text>}
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Tab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  coverContainer: { height: 180 },
  cover: { width: "100%", height: "100%" },

  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  avatarWrapper: {
    alignSelf: "center",
    marginTop: -40,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 24,
  },

  camera: {
    position: "absolute",
    bottom: 0,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  email: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 12,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },

  social: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },

  stat: { alignItems: "center" },
  statValue: { fontWeight: "700", fontSize: 16 },
  statExtra: { fontSize: 12 },
  statLabel: { fontSize: 12, opacity: 0.6 },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },

  followBtn: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  followText: { color: "#fff", fontWeight: "600" },

  moreBtn: {
    width: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: "#000",
  },

  tabText: { opacity: 0.5 },
  tabTextActive: { opacity: 1, fontWeight: "600" },

  row: { gap: 12, paddingHorizontal: 20 },
  post: {
    flex: 1,
    height: 160,
    borderRadius: 16,
    marginBottom: 12,
  },
});
