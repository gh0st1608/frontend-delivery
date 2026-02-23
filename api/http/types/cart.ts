import { BaseResponse } from "./common";

// ----------- Payloads -----------
export interface CreateCartItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}


// ----------- Responses -----------
export interface CreateCartItemResponse extends BaseResponse {
  cart : {
    id : string
  }
}

export interface ListCartsResponse extends BaseResponse {
  items: Cart[];
  nextCursor: string;
}

export interface Cart {
  active?: boolean;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}