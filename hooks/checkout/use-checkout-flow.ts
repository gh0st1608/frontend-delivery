import { useCartStore } from "@/store/car-store";
import { useCreateOrder } from "../order/use-order";
import { useCallback, useState } from "react";
import { PaymentStatus } from "@/api/http/types/payment";
import { useCheckoutStore } from "@/store/checkout-store";
import { PaymentService } from "@/api/http/services/payment.service";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Alert, Platform } from "react-native";

export function useCheckoutFlow() {
  const { createOrder } = useCreateOrder();
  const itemsCount = useCartStore((s) => s.items.length);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const checkoutStore = useCheckoutStore.getState();

      if (itemsCount === 0) {
        throw new Error("Tu carrito está vacío");
      }

      if (checkoutStore.paymentMethod !== "paypal") {
        throw new Error("Por ahora solo se acepta pago con PayPal");
      }

      // 1️⃣ Garantizar geocoding
      await checkoutStore.ensureAddressGeocoded();

      const { address } = useCheckoutStore.getState();

      if (address.lat == null || address.lng == null) {
        throw new Error("No se pudo ubicar la dirección de entrega");
      }

      // 2️⃣ Crear orden pasando coordenadas
      const { orderId } = await createOrder(address.lat, address.lng);

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
    } catch (e: any) {
      console.error(e);
      const message = e?.message || "No se pudo iniciar el pago";
      setStatus("failure");
      setError(message);
      // El pago aún no empezó: el usuario se queda en checkout para corregir
      Alert.alert("Checkout", message);
    } finally {
      setLoading(false);
    }
  }, [createOrder, itemsCount]);

  return {
    startCheckout,
    loading,
    status,
    error,
  };
}
