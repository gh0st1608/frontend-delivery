import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import HeaderHome from "@/components/home/header-home";
import CategoryCard from "@/components/home/category-card";
import ProductCard from "@/components/home/product-card";
import SearchWithFilter from "@/components/home/search-input";

import { useProducts } from "@/hooks/product/use-products";
import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import { useCategories } from "@/hooks/category/use-categories";

export default function MainPageScreen() {
  const { user } = useAuth();
  const { products, fetchProducts } = useProducts();
  const { categories, fetchCategories } = useCategories();

  const insets = useSafeAreaInsets(); // 🔥 clave

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 120 }, // 🔥 espacio real para tab bar
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <HeaderHome
        username={user?.name ?? "Invitado"}
        onMenuPress={() => router.push("/settings")}
      />

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <SearchWithFilter
          placeholder="Buscar productos..."
          onFocus={() => router.push("/home/search")}
        />
      </View>

      {/* CATEGORÍAS */}
      <View style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Categorías
        </ThemedText>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.categoryId.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard name={item.name} icon={item.image} />
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* POPULARES */}
      <View style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Más populares
        </ThemedText>

        <FlatList
          data={products.slice(0, 5)}
          keyExtractor={(item) => item.productId.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              name={item.name}
              price={item.price}
              imageUrl={item.image}
              onPress={() =>
                router.push({
                  pathname: "/product/[productId]",
                  params: { productId: item.productId.toString() },
                })
              }
            />
          )}
        />
      </View>

      {/* RECOMENDADOS */}
      {products.length > 5 && (
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Recomendados
          </ThemedText>

          <FlatList
            data={products.slice(5, 10)}
            keyExtractor={(item) => item.productId.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductCard
                name={item.name}
                price={item.price}
                imageUrl={item.image}
                onPress={() =>
                  router.push({
                    pathname: "/product/[productId]",
                    params: { productId: item.productId.toString() },
                  })
                }
              />
            )}
          />
        </View>
      )}

      {/* BTN FLOTANTE */}
      <TouchableOpacity style={styles.fab}>
        <ThemedText type="defaultSemiBold" style={styles.fabText}>
          Ver carrito
        </ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  searchContainer: {
    marginTop: 12,
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    marginBottom: 12,
    fontSize: 22,
    fontWeight: "700",
  },

  categoriesList: {
    gap: 14,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  fab: {
    alignSelf: "center",
    marginTop: 18,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 40,
  },

  fabText: {
    color: "#fff",
    fontSize: 16,
  },
});
