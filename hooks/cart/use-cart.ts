import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { CartService } from "@/api/http/services/cart.service";
import { ProductService } from "@/api/http/services/product.service";
import { OrderService } from "@/api/http/services/order.service";
import { useAuth } from "@/hooks/use-auth";
import { CartItemUI, useCartStore } from "@/store/car-store";
import { Cart } from "@/api/http/types/cart";
import { Product } from "@/api/http/types/product";

// Items guardados antes de persistir storeId/imagen se completan desde shop
async function enrichItem(item: Cart): Promise<CartItemUI> {
  if (item.storeId && item.image) {
    return { ...item, storeId: item.storeId, image: item.image };
  }

  try {
    const { product } = await ProductService.getProductById(item.productId);
    return {
      ...item,
      storeId: item.storeId || product.storeId,
      image: item.image || product.image,
    };
  } catch {
    return { ...item, storeId: item.storeId ?? "", image: item.image ?? "" };
  }
}

export const useCarts = () => {
  const { user } = useAuth();
  const { addItem, setCart, setQuantity, removeItem, clear, setPricing } =
    useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [{ cart }] = await Promise.all([
        CartService.getMyCart(),
        loadPricing(),
      ]);
      const items = await Promise.all(cart.items.map(enrichItem));

      setCart(items);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el carrito");
    } finally {
      setLoading(false);
    }
  }, [user?.userId, setCart]);

  // Tarifa de envío y tipo de cambio parametrizados en backend
  async function loadPricing() {
    try {
      const { pricing } = await OrderService.getPricing();
      setPricing({
        deliveryFeeClp: pricing.deliveryFeeClp,
        usdClp: pricing.exchangeRateUsdClp,
      });
    } catch (err) {
      console.warn("No se pudo cargar la tarifa de envío", err);
    }
  }

  const addToCart = useCallback(
    async (product: Product, quantity: number = 1): Promise<boolean> => {
      if (!user) return false;

      // 🚫 No mezclar tiendas: se valida antes de persistir en backend
      const { storeId } = useCartStore.getState();
      if (storeId && storeId !== product.storeId) {
        Alert.alert(
          "Carrito",
          "Tu carrito tiene productos de otra tienda. Vacíalo o finaliza ese pedido primero.",
        );
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        const item: CartItemUI = {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity,
          storeId: product.storeId,
          image: product.image,
        };

        await CartService.addItemCart(item);
        addItem(item);
        return true;
      } catch (err: any) {
        console.error(err);
        setError("No se pudo agregar al carrito");
        Alert.alert("Carrito", err?.message || "No se pudo agregar al carrito");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.userId, addItem]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // quantity = 0 elimina el item en backend
        await CartService.updateItemQuantity(productId, { quantity });
        setQuantity(productId, quantity);
      } catch (err: any) {
        console.error(err);
        setError("No se pudo actualizar el carrito");
        Alert.alert("Carrito", err?.message || "No se pudo actualizar el carrito");
      } finally {
        setLoading(false);
      }
    },
    [user?.userId, setQuantity]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        await CartService.removeItem(productId);
        removeItem(productId);
      } catch (err: any) {
        console.error(err);
        setError("No se pudo eliminar el producto");
        Alert.alert("Carrito", err?.message || "No se pudo eliminar el producto");
      } finally {
        setLoading(false);
      }
    },
    [user?.userId, removeItem]
  );

  const clearCart = useCallback(async () => {
    clear();

    if (!user) return;

    try {
      await CartService.clearCart();
    } catch (err) {
      // El carrito puede no existir en backend; localmente ya quedó vacío
      console.warn("Clear cart failed", err);
    }
  }, [user?.userId, clear]);

  return {
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
    error,
  };
};
