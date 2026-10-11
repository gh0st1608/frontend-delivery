import { BaseResponse } from "./common";

// ----------- Payloads -----------
export interface CreateCartItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  image: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}


// ----------- Responses -----------
export interface CreateCartItemResponse extends BaseResponse {
  cart : {
    cartId : string
  }
}

export interface GetCartResponse extends BaseResponse {
  cart: {
    items: Cart[];
    total: number;
  };
}

export interface Cart {
  active?: boolean;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  storeId?: string;
  image?: string;
}
