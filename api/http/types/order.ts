import { Cart } from "./cart";
import { BaseResponse } from "./common";

// ----------- Payloads -----------
export interface CreateOrderPayload {
  userId: string;
  storeId: string;
  deliveryLat: number;
  deliveryLng: number;
  items: Cart[];
}


// ----------- Responses -----------
export interface CreateOrderResponse extends BaseResponse {
  order : {
    orderId : string
  }
}

export interface ListOrdersResponse extends BaseResponse {
  items: Order[];
  nextCursor: string;
}

export interface GetOrderStatusDeliveryResponse extends BaseResponse {
  order : {
    statusDelivery: string;
  }
}

export interface Order {
  orderId: string;
  userId: string;
  items: Cart[];
  totalAmount: number;
  status: string;
  active: boolean;
}