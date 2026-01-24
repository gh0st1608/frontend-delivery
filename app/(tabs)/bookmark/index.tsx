import { View, FlatList, StyleSheet } from "react-native";
import { BookmarkCard } from "@/components/bookmark/bookmark-card";
import { BookmarkSearch } from "@/components/bookmark/bookmark-search";
import { BookmarkHeader } from "@/components/bookmark/bookmark-header";
import { useBookmarks } from "@/hooks/bookmark/use-bookmarks";

export default function BookmarkScreen() {
  const { bookmarks, query, setQuery, toggleBookmark } = useBookmarks();

  return (
    <View style={styles.container}>
      <BookmarkHeader />

      <BookmarkSearch value={query} onChange={setQuery} />

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <BookmarkCard
            product={item}
            onToggle={() => toggleBookmark(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  list: {
    paddingBottom: 120,
  },
});
