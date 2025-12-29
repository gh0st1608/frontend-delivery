import shopApi from "../clients/shop.client";
import {
  ApiParamsRequest,
  ApiResponse,
  ApiResponseError,
} from "../types/common";
import { GetProductByIdResponse, ListProductsResponse } from "../types/product";

export const ProductService = {
  async getProducts(params: ApiParamsRequest): Promise<ListProductsResponse> {
    const res = await shopApi.get<
      ApiResponse<ListProductsResponse> | ApiResponseError
    >("/products", { params });

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },

  async getProductById(productId: string): Promise<GetProductByIdResponse> {
    const res = await shopApi.get<ApiResponse<GetProductByIdResponse> | ApiResponseError>(
      `/products/${productId}`
    );

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },

  

};
