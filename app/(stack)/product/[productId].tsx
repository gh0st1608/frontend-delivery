import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useProductDetail } from "@/hooks/product/use-product-detail";
import { useCarts } from "@/hooks/cart/use-cart";
import { BaseHeader } from "@/components/base-header";
import { formatCLP } from "@/utils/currency";

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { productDetail, loading, error, fetchProductDetail } =
    useProductDetail();
  const { addToCart, loading: adding } = useCarts();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      fetchProductDetail(productId);
    }
  }, [productId, fetchProductDetail]);

  // Antes de la primera respuesta no hay producto ni error: también es carga
  if (loading || (!productDetail && !error)) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!productDetail) {
    return (
      <View style={styles.centered}>
        <Text style={styles.description}>
          {error ?? "Producto no encontrado"}
        </Text>
        {productId && (
          <TouchableOpacity
            style={[styles.cartButton, { marginTop: 16 }]}
            onPress={() => fetchProductDetail(productId)}
          >
            <Text style={styles.cartButtonText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const { image, name, price, description, stock, ingredients = [] } =
    productDetail;

  const totalPrice = price * quantity;
  const maxQuantity = stock > 0 ? stock : 1;
  const outOfStock = stock <= 0;

  const handleAddToCart = async () => {
    const added = await addToCart(productDetail, quantity);
    if (added) {
      router.push("/cart");
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BaseHeader title="Product Details" />
        </View>

        {/* IMAGE */}
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{formatCLP(price)}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* INGREDIENTS CAROUSEL */}
          {ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ingredientsCarousel}
              >
                {ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientChip}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    {!!ingredient.image && (
                      <Image
                        source={{ uri: ingredient.image }}
                        style={styles.ingredientImage}
                        resizeMode="cover"
                      />
                    )}
                    {!!ingredient.quantity && !!ingredient.unit && (
                      <Text style={styles.ingredientQty}>
                        {ingredient.quantity}
                        {ingredient.unit}
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FIXED ACTION BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total price</Text>
          <Text style={styles.totalPrice}>{formatCLP(totalPrice)}</Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              disabled={quantity <= 1}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              hitSlop={8}
            >
              <Text style={styles.qtyButton}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              disabled={quantity >= maxQuantity}
              onPress={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              hitSlop={8}
            >
              <Text style={styles.qtyButton}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.cartButton,
              (adding || outOfStock) && styles.cartButtonDisabled,
            ]}
            disabled={adding || outOfStock}
            onPress={handleAddToCart}
            activeOpacity={0.9}
          >
            {adding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.cartButtonText}>
                {outOfStock ? "Agotado" : "Agregar al carrito"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 140, // ⬅️ antes 40
  },

  image: {
    width: "100%",
    height: 260,
  },

  content: {
    padding: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 6,
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6C44",
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  ingredientsCarousel: {
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  ingredientImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginVertical: 6,
  },

  ingredientChip: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    width: 100, // ⬅️ importante para que no se aplaste
  },

  ingredientName: {
    fontSize: 14,
    fontWeight: "600",
  },

  ingredientQty: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  priceContainer: {
    marginBottom: 10,
  },

  totalLabel: {
    fontSize: 12,
    color: "#888",
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },

  qtyButton: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },

  qtyValue: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 8,
  },

  cartButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 22,
    height: 44,
    justifyContent: "center",
  },

  cartButtonDisabled: {
    opacity: 0.5,
  },

  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
