import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { PaymentService } from "@/api/http/services/payment.service";
import { useCarts } from "@/hooks/cart/use-cart";

export function usePaymentSuccess() {
  const { token, PayerID } = useLocalSearchParams<{
    token: string;
    PayerID: string;
    provider: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('')
  const { clearCart } = useCarts();
  const confirmingRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/payment/failure");
      return;
    }

    // Evita confirmar dos veces el mismo token (re-montajes / StrictMode)
    if (confirmingRef.current === token) return;
    confirmingRef.current = token;

    const confirmPayment = async () => {
      try {
        const { payment } = await PaymentService.confirmPayment({
          token,
          PayerID,
          provider: 'Paypal'
        });

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );

        // El pedido ya está pagado: recién ahora se vacía el carrito
        await clearCart();

        setConfirmed(true);
        setOrderId(payment.orderId)
      } catch (error) {
        console.error("Payment confirmation failed", error);
        router.replace("/payment/failure");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [token, PayerID]);

  return {
    loading,
    confirmed,
    orderId
  };
}
