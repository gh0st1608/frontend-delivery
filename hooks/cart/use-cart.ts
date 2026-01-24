import { useCallback, useState } from "react";
import { CartService } from "@/api/services/cart.service";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/store/car-store";
import { Product } from "@/api/types/product";

export const useCarts = () => {
  const { user } = useAuth();
  const productsById = new Map<string, Product>();
  const { addItem, setCart, clear } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const cart = await CartService.getCartByUser(user.userId);

      const items = cart.items.map((item) => {
        const product = productsById.get(item.productId);

        return {
          ...item,
          image: product?.image ?? "",
        };
      });

      setCart(items);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el carrito");
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  const addToCart = useCallback(
    async (product: Product, quantity: number = 1) => {
      if (!user) return;

      try {
        setLoading(true);

        const payload = {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity,
        };
        await CartService.addItemCart(payload, user.userId);
        addItem({
          ...payload,
          image: product.image, // ✅ UI enrichment
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo agregar al carrito");
      } finally {
        setLoading(false);
      }
    },
    [user?.userId]
  );

  return {
    loadCart,
    addToCart,
    clear,
    loading,
    error,
  };
};
