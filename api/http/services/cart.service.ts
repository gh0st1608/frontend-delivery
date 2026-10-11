import checkoutApi from "../clients/checkout.client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import {
  CreateCartItemPayload,
  CreateCartItemResponse,
  GetCartResponse,
  UpdateCartItemPayload,
} from "../types/cart";

// Siempre el carrito del usuario autenticado: el backend lo toma del token
export const CartService = {
  async getMyCart(): Promise<GetCartResponse> {
    const res = await checkoutApi.get<
      ApiResponse<GetCartResponse> | ApiResponseError
    >(`/carts/me`);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  async addItemCart(payload: CreateCartItemPayload): Promise<CreateCartItemResponse> {
    const request: ApiRequest<{ Cart: CreateCartItemPayload }> = {
      Data: {
        Cart: payload,
      },
    };

    const res = await checkoutApi.post<ApiResponse<CreateCartItemResponse> | ApiResponseError>(
      `/carts/me/items`,
      request
    );

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  async updateItemQuantity(
    productId: string,
    payload: UpdateCartItemPayload,
  ): Promise<CreateCartItemResponse> {
    const request: ApiRequest<{ Cart: UpdateCartItemPayload }> = {
      Data: {
        Cart: payload,
      },
    };

    const res = await checkoutApi.patch<
      ApiResponse<CreateCartItemResponse> | ApiResponseError
    >(`/carts/me/items/${productId}`, request);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  async removeItem(productId: string): Promise<CreateCartItemResponse> {
    const res = await checkoutApi.delete<
      ApiResponse<CreateCartItemResponse> | ApiResponseError
    >(`/carts/me/items/${productId}`);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  async clearCart(): Promise<CreateCartItemResponse> {
    const res = await checkoutApi.delete<
      ApiResponse<CreateCartItemResponse> | ApiResponseError
    >(`/carts/me`);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
};
