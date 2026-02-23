import checkoutApi from "../clients/checkout.client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import { CreateCartItemPayload, CreateCartItemResponse, ListCartsResponse } from "../types/cart";

export const CartService = {
  async getCartByUser(userId: string): Promise<ListCartsResponse> {
    const res = await checkoutApi.get<
      ApiResponse<ListCartsResponse> | ApiResponseError
    >(`/carts/${userId}`);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  async addItemCart(payload: CreateCartItemPayload, userId: string): Promise<CreateCartItemResponse> {
    const request: ApiRequest<{ Cart: CreateCartItemPayload }> = {
      Data: {
        Cart: payload,
      },
    };

    const res = await checkoutApi.post<ApiResponse<CreateCartItemResponse> | ApiResponseError>(
      `/carts/${userId}/items`,
      request
    );

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
};
