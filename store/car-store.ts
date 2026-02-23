import { create } from "zustand";
import { CreateCartItemPayload } from "@/api/http/types/cart";

export type CartItemUI = CreateCartItemPayload & {
  image: string;
  storeId: string; // importante: el item conoce su tienda
};

interface CartState {
  storeId: string | null;
  items: CartItemUI[];
  totalItems: number;

  subtotal: number;
  delivery: number;
  total: number;

  setCart: (items: CartItemUI[]) => void;
  addItem: (item: CartItemUI) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
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

const calculateDelivery = (items: CartItemUI[]) =>
  items.length > 0 ? 5 : 0;

const calculateCartTotals = (items: CartItemUI[]) => {
  const subtotal = calculateSubtotal(items);
  const delivery = calculateDelivery(items);
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

  /* ---------------------------------- */
  /* Set completo (ej: desde backend / storage) */
  /* ---------------------------------- */
  setCart: (items) =>
    set({
      storeId: items.length > 0 ? items[0].storeId : null,
      items,
      ...calculateCartTotals(items),
    }),

  /* ---------------------------------- */
  /* Add item */
  /* ---------------------------------- */
  addItem: (item) => {
    const { storeId, items: currentItems } = get();
    console.log('storeId',storeId)
    // 🚫 No mezclar tiendas
    if (storeId && storeId !== item.storeId) {
      throw new Error("No se pueden mezclar productos de diferentes tiendas");
    }

    const items = [...currentItems];
    const existing = items.find(
      (i) => i.productId === item.productId,
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }

    set({
      storeId: storeId ?? item.storeId,
      items,
      ...calculateCartTotals(items),
    });
  },

  /* ---------------------------------- */
  /* Increment */
  /* ---------------------------------- */
  increment: (productId) => {
    const items = get().items.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );

    set({
      items,
      ...calculateCartTotals(items),
    });
  },

  /* ---------------------------------- */
  /* Decrement */
  /* ---------------------------------- */
  decrement: (productId) => {
    const items = get()
      .items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      )
      .filter((item) => item.quantity > 0);

    set({
      storeId: items.length > 0 ? get().storeId : null,
      items,
      ...calculateCartTotals(items),
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
      ...calculateCartTotals(items),
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
