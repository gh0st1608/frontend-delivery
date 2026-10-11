import { BaseResponse } from "./common";

// ----------- Payloads -----------
// Solo producto y cantidad: precios y usuario los determina el backend
export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  storeId: string;
  deliveryLat: number;
  deliveryLng: number;
  items: CreateOrderItemPayload[];
}


// ----------- Responses -----------
// Montos en CLP (lo que ve el cliente) y su equivalente en USD (lo que cobra
// PayPal), con el tipo de cambio congelado al crear la orden.
export interface OrderTotals {
  currency: "CLP";
  subtotalClp: number;
  deliveryFeeClp: number;
  totalClp: number;
  exchangeRateUsdClp: number;
  totalUsd: number;
}

export interface CreateOrderResponse extends BaseResponse {
  order: OrderTotals & {
    orderId: string;
  };
}

export interface ListOrdersResponse extends BaseResponse {
  items: Order[];
  nextCursor: string;
}

export interface GetOrderByIdResponse extends BaseResponse {
  order: Order;
}

export interface ConfirmDeliveryResponse extends BaseResponse {
  order: {
    orderId: string;
  };
}

export interface PricingResponse extends BaseResponse {
  pricing: {
    currency: "CLP";
    deliveryFeeClp: number;
    deliveryFeeUsd: number;
    exchangeRateUsdClp: number;
    exchangeRateSource: "BANCO_CENTRAL" | "MANUAL" | "FALLBACK";
    exchangeRateDate: string;
  };
}

export type OrderDeliveryStatus =
  | "CREATED"
  | "ASSIGNED"
  | "PREPARING"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELED";

export interface GetOrderStatusDeliveryResponse extends BaseResponse {
  order : {
    statusDelivery: OrderDeliveryStatus;
  }
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number; // CLP
  quantity: number;
}

export interface Order extends OrderTotals {
  orderId: string;
  userId: string;
  storeId: string;
  items: OrderItem[];
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  statusDelivery: OrderDeliveryStatus;
}
