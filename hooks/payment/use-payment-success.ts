import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { PaymentService } from "@/api/http/services/payment.service";

export function usePaymentSuccess() {
  const { token, PayerID } = useLocalSearchParams<{
    token: string;
    PayerID: string;
    provider: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    if (!token) {
      router.replace("/payment/failure");
      return;
    }

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
