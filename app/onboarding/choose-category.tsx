import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useChooseCategory } from "@/hooks/onboarding/use-choose-category";

export default function ChooseCategoryScreen() {
  const {
    categories,
    loading,
    selected,
    toggleCategory,
    continueFlow,
    canContinue,
    saving,
  } = useChooseCategory();

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose category</Text>
      <Text style={styles.subtitle}>Choose your favorite food</Text>

      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.categoryId}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.categoryId);

          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => toggleCategory(item.categoryId)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={[styles.button, !canContinue && styles.buttonDisabled]}
        disabled={!canContinue}
        onPress={continueFlow}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  card: {
    width: "48%",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    color: "#777",
    marginBottom: 20,
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: "#FF6C44",
    backgroundColor: "#FFF2EE",
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
