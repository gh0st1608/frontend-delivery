import { create } from "zustand";
import { MapsService } from "@/api/http/services/maps.service";

export type PaymentMethod =
  | "paypal"
  | "credit-card"
  | "apple-pay"
  | "google-pay";

interface Address {
  city: string;
  street: string;
  lat?: number;
  lng?: number;
  fullAddress?: string;
}

interface CheckoutState {
  paymentMethod: PaymentMethod;
  address: Address;
  loadingAddress: boolean;

  setPaymentMethod: (method: PaymentMethod) => void;
  setAddress: (address: Partial<Address>) => void;

  updateAddressFromCoordinates: (lat: number, lng: number) => Promise<void>;

  ensureAddressGeocoded: () => Promise<void>;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  paymentMethod: "credit-card",

  address: {
    city: "Los Angeles/California",
    street: "3252 Hillhaven Drive",
  },

  loadingAddress: false,

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  setAddress: (address) =>
    set((state) => ({
      address: { ...state.address, ...address },
    })),

  updateAddressFromCoordinates: async (lat, lng) => {
    try {
      set({ loadingAddress: true });

      const result = await MapsService.reverseGeocode(lat, lng);

      set((state) => ({
        address: {
          ...state.address,
          lat,
          lng,
          city: result.city,
          street: result.street,
          fullAddress: result.fullAddress,
        },
        loadingAddress: false,
      }));
    } catch (error) {
      console.error("Reverse geocode failed:", error);
      set({ loadingAddress: false });
      throw error; // 🔥 importante propagar error
    }
  },

  ensureAddressGeocoded: async () => {
    const { address } = get();
    // ✅ Si ya está geocodificada, no hacer nada
    if (address.lat != null && address.lng != null) {
      return;
    }

    if (!address.street || !address.city) {
      throw new Error("Address is incomplete");
    }

    try {
      set({ loadingAddress: true });

      const fullAddress = `${address.street}, ${address.city}`;
      const result = await MapsService.geocodeAddress(fullAddress);

      set((state) => ({
        address: {
          ...state.address,
          lat: result.lat,
          lng: result.lng,
        },
        loadingAddress: false,
      }));
    } catch (error) {
      console.error("Geocode failed:", error);
      set({ loadingAddress: false });
      throw new Error("Address not geocoded test");
    }
  },
}));
