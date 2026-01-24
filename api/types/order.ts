import { Cart } from "./cart";
import { BaseResponse } from "./common";

// ----------- Payloads -----------
export interface CreateOrderPayload {
  userId: string;
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

export interface Order {
  orderId: string;
  userId: string;
  items: Cart[];
  totalAmount: number;
  status: string;
  active: boolean;
}