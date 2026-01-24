import { create } from "zustand";
import { CreateCartItemPayload } from "@/api/types/cart";

export type CartItemUI = CreateCartItemPayload & {
  image: string;
};

interface CartState {
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


export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  subtotal: 0,
  delivery: 0,
  total: 0,

  setCart: (items) =>
    set({
      items,
      ...calculateCartTotals(items),
    }),

  addItem: (item) => {
    const items = [...get().items];
    const existing = items.find(
      (i) => i.productId === item.productId
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }

    set({
      items,
      ...calculateCartTotals(items),
    });
  },

  increment: (productId) => {
    const items = get().items.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    set({
      items,
      ...calculateCartTotals(items),
    });
  },

  decrement: (productId) => {
    const items = get().items
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    set({
      items,
      ...calculateCartTotals(items),
    });
  },

  removeItem: (productId) => {
    const items = get().items.filter(
      (i) => i.productId !== productId
    );

    set({
      items,
      ...calculateCartTotals(items),
    });
  },

  clear: () =>
    set({
      items: [],
      totalItems: 0,
      subtotal: 0,
      delivery: 0,
      total: 0,
    }),
}));
