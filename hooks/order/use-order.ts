import { useCartStore } from "@/store/car-store";
import { useAuth } from "../use-auth";
import { useCallback, useState } from "react";
import { CreateOrderPayload, CreateOrderResponse } from "@/api/http/types/order";
import { OrderService } from "@/api/http/services/order.service";

export function useCreateOrder() {
  const { user } = useAuth();
  const storeId = useCartStore((s) => s.storeId);
  const items = useCartStore((s) => s.items);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(
    async (
      deliveryLat: number,
      deliveryLng: number,
    ): Promise<CreateOrderResponse["order"]> => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      if (!storeId) {
        throw new Error("El carrito no tiene tienda asociada");
      }

      setLoading(true);
      setError(null);

      try {
        // Precios, totales y usuario los calcula el backend
        const payload: CreateOrderPayload = {
          storeId,
          deliveryLat,
          deliveryLng,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        };
        const { order } = await OrderService.createOrder(payload);

        // El carrito se vacía recién cuando el pago se confirma
        return order;
      } catch (err) {
        setError("No se pudo crear la orden");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, storeId, items]
  );

  return {
    createOrder,
    loading,
    error,
  };
}
