import { useCartStore } from "@/store/car-store";
import { useCreateOrder } from "../order/use-order";
import { useCallback, useState } from "react";
import { PaymentStatus } from "@/api/http/types/payment";
import { useCheckoutStore } from "@/store/checkout-store";
import { PaymentService } from "@/api/http/services/payment.service";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { router } from "expo-router";

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
      const checkoutStore = useCheckoutStore.getState();

      // 1️⃣ Garantizar geocoding
      await checkoutStore.ensureAddressGeocoded();

      const { address } = useCheckoutStore.getState();

      if (address.lat == null || address.lng == null) {
        throw new Error("Address not geocoded");
      }

      // 2️⃣ Crear orden pasando coordenadas
      const orderId = await createOrder(address.lat, address.lng);

      // 3️⃣ URLs por plataforma
      const successUrl =
        Platform.OS === "web"
          ? `${window.location.origin}/payment/success`
          : Linking.createURL("payment/success");

      const cancelUrl =
        Platform.OS === "web"
          ? `${window.location.origin}/payment/failure`
          : Linking.createURL("payment/failure");

      // 4️⃣ Crear pago
      const {
        payment: { redirectUrl },
      } = await PaymentService.createPaypalPayment({
        orderId,
        amount: total,
        currency: "USD",
        provider: "Paypal",
        successUrl,
        cancelUrl,
      });

      setStatus("pending");

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
