import { useCartStore } from "@/store/car-store";
import { useAuth } from "../use-auth";
import { useCallback, useState } from "react";
import { CreateOrderPayload } from "@/api/http/types/order";
import { OrderService } from "@/api/http/services/order.service";

export function useCreateOrder() {
  const { user } = useAuth();
  const storeId = useCartStore((s) => s.storeId);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(
    async (deliveryLat: number, deliveryLng: number): Promise<string> => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      if (!storeId) {
        throw new Error("El carrito no tiene tienda asociada");
      }

      setLoading(true);
      setError(null);

      try {
        const payload: CreateOrderPayload = {
          userId: user.userId,
          storeId,
          deliveryLat,
          deliveryLng,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        };
        const { order } = await OrderService.createOrder(payload);

        clearCart();

        return order.orderId;
      } catch (err) {
        setError("No se pudo crear la orden");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, storeId, items, clearCart]
  );

  return {
    createOrder,
    loading,
    error,
  };
}
