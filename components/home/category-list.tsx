import { FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

export const CategoryList = ({ categories }: { categories: any[] }) => {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 24 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#F4F4F4",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});
