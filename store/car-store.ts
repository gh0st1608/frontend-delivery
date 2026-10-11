import { create } from "zustand";
import { CreateCartItemPayload } from "@/api/http/types/cart";

// El item conoce su tienda (storeId) e imagen: ambos se persisten en backend
export type CartItemUI = CreateCartItemPayload;

interface CartState {
  storeId: string | null;
  items: CartItemUI[];
  totalItems: number;

  // Montos en CLP. deliveryFee y usdClp vienen de backend-order (Settings)
  subtotal: number;
  delivery: number;
  total: number;
  deliveryFee: number;
  usdClp: number;

  setPricing: (pricing: { deliveryFeeClp: number; usdClp: number }) => void;
  setCart: (items: CartItemUI[]) => void;
  addItem: (item: CartItemUI) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

/* ---------------------------------- */
/* Utils */
/* ---------------------------------- */

const calculateTotalItems = (items: CartItemUI[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0);

const calculateSubtotal = (items: CartItemUI[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

const calculateDelivery = (items: CartItemUI[], deliveryFee: number) =>
  items.length > 0 ? deliveryFee : 0;

const calculateCartTotals = (items: CartItemUI[], deliveryFee = 0) => {
  const subtotal = calculateSubtotal(items);
  const delivery = calculateDelivery(items, deliveryFee);
  const total = subtotal + delivery;

  return {
    totalItems: calculateTotalItems(items),
    subtotal,
    delivery,
    total,
  };
};

/* ---------------------------------- */
/* Store */
/* ---------------------------------- */

export const useCartStore = create<CartState>((set, get) => ({
  storeId: null,
  items: [],
  totalItems: 0,
  subtotal: 0,
  delivery: 0,
  total: 0,
  deliveryFee: 0,
  usdClp: 0,

  /* ---------------------------------- */
  /* Parámetros de precio (tarifa de envío y tipo de cambio) */
  /* ---------------------------------- */
  setPricing: ({ deliveryFeeClp, usdClp }) =>
    set({
      deliveryFee: deliveryFeeClp,
      usdClp,
      ...calculateCartTotals(get().items, deliveryFeeClp),
    }),

  /* ---------------------------------- */
  /* Set completo (ej: desde backend / storage) */
  /* ---------------------------------- */
  setCart: (items) =>
    set({
      storeId: items.find((i) => i.storeId)?.storeId ?? null,
      items,
      ...calculateCartTotals(items, get().deliveryFee),
    }),

  /* ---------------------------------- */
  /* Add item */
  /* ---------------------------------- */
  addItem: (item) => {
    const { storeId, items: currentItems } = get();
    // 🚫 No mezclar tiendas
    if (storeId && storeId !== item.storeId) {
      throw new Error("No se pueden mezclar productos de diferentes tiendas");
    }

    const existing = currentItems.find(
      (i) => i.productId === item.productId,
    );

    // Se crean objetos nuevos para que los selectores detecten el cambio
    const items = existing
      ? currentItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        )
      : [...currentItems, item];

    set({
      storeId: storeId ?? item.storeId,
      items,
      ...calculateCartTotals(items, get().deliveryFee),
    });
  },

  /* ---------------------------------- */
  /* Set quantity (0 elimina el item) */
  /* ---------------------------------- */
  setQuantity: (productId, quantity) => {
    const items = get()
      .items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      )
      .filter((item) => item.quantity > 0);

    set({
      storeId: items.length > 0 ? get().storeId : null,
      items,
      ...calculateCartTotals(items, get().deliveryFee),
    });
  },

  /* ---------------------------------- */
  /* Remove item */
  /* ---------------------------------- */
  removeItem: (productId) => {
    const items = get().items.filter(
      (i) => i.productId !== productId,
    );

    set({
      storeId: items.length > 0 ? get().storeId : null,
      items,
      ...calculateCartTotals(items, get().deliveryFee),
    });
  },

  /* ---------------------------------- */
  /* Clear */
  /* ---------------------------------- */
  clear: () =>
    set({
      storeId: null,
      items: [],
      totalItems: 0,
      subtotal: 0,
      delivery: 0,
      total: 0,
    }),
}));
