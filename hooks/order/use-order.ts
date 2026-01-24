import { useState, useCallback } from "react";
import { OrderService } from "@/api/services/order.service";
import { useCartStore } from "@/store/car-store";
import { useAuth } from "../use-auth";
import { CreateOrderPayload } from "@/api/types/order";

export function useCreateOrder() {
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (): Promise<string> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateOrderPayload = {
        userId: user.userId,
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
  }, [user, items, clearCart]);

  return {
    createOrder,
    loading,
    error,
  };
}
