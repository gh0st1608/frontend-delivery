import { create } from "zustand";

export type PaymentMethod =
  | "paypal"
  | "credit-card"
  | "apple-pay"
  | "google-pay";

interface CheckoutState {
  paymentMethod: PaymentMethod;
  address: {
    city: string;
    street: string;
  };

  setPaymentMethod: (method: PaymentMethod) => void;
  setAddress: (address: CheckoutState["address"]) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  paymentMethod: "credit-card",

  address: {
    city: "Los Angeles/California",
    street: "3252 Hillhaven Drive",
  },

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setAddress: (address) => set({ address }),
}));
