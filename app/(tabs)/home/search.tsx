import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";

import ProductCard from "@/components/home/product-card";
import EmptySearch from "@/components/home/empty-search";
import SearchWithFilter from "@/components/home/search-input";
import { useProducts } from "@/hooks/product/use-products";
import { useCarts } from "@/hooks/cart/use-cart";
import { router } from "expo-router";

export default function SearchFoodScreen() {
  const [query, setQuery] = useState("");
  const { products, loading, fetchProducts } = useProducts();
  const { addToCart } = useCarts();
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    if (!hasQuery) return;

    const delay = setTimeout(() => {
      fetchProducts({ search: query.trim() });
    }, 400);

    return () => clearTimeout(delay);
  }, [query, hasQuery, fetchProducts]);

  // Sin texto no se muestran resultados de una búsqueda anterior
  const results = hasQuery ? products : [];

  const showResultsText = !loading && hasQuery && results.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <SearchWithFilter
          placeholder="Buscar comida"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* RESULT COUNT */}
      {showResultsText && (
        <Text style={styles.resultsText}>
          Found {results.length}{" "}
          <Text style={styles.highlight}>{query}</Text> food results
        </Text>
      )}

      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      {!loading && hasQuery && results.length === 0 && (
        <EmptySearch />
      )}

      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.productId.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              name={item.name}
              price={item.price}
              imageUrl={item.image}
              storeId={item.storeId}
              variant="grid"
              onPress={() =>
                router.push({
                  pathname: "/product/[productId]",
                  params: { productId: item.productId },
                })
              }
              onAdd={() => addToCart(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  searchHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  resultsText: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
    color: "#555",
  },

  highlight: {
    fontWeight: "600",
    color: "#000",
  },

  loader: {
    marginTop: 40,
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
