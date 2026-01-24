import { useState, useCallback } from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useCreateOrder } from "../order/use-order";
import { PaymentService } from "@/api/services/payment.service";
import { PaymentStatus } from "@/api/types/payment";
import { useCartStore } from "@/store/car-store";

export function useCheckoutFlow() {
  const { createOrder } = useCreateOrder();
  const total = useCartStore((s) => s.total);



  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Crear orden
      const orderId = await createOrder();

      // 2️⃣ URLs correctas por plataforma
      const successUrl =
        Platform.OS === "web"
          ? `${window.location.origin}/payment/success`
          : Linking.createURL("payment/success");

      const cancelUrl =
        Platform.OS === "web"
          ? `${window.location.origin}/payment/failure`
          : Linking.createURL("payment/failure");

      // 3️⃣ Crear pago PayPal
      const { payment : { redirectUrl }} = await PaymentService.createPaypalPayment({
        orderId,
        amount: total,
        currency: "USD",
        provider: "Paypal",
        successUrl,
        cancelUrl,
      });

      setStatus("pending");

      // 4️⃣ Redirección correcta
      if (Platform.OS === "web") {
        window.location.assign(redirectUrl);
      } else {
        await WebBrowser.openBrowserAsync(redirectUrl, {
          presentationStyle:
            WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        });
      }
    } catch (e) {
      console.error(e);
      setStatus("failure");
      setError("No se pudo completar el pago");
      router.replace("/payment/failure");
    } finally {
      setLoading(false);
    }
  }, [createOrder, total]);

  return {
    startCheckout,
    loading,
    status,
    error,
  };
}
