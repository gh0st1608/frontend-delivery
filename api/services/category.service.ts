// api/services/category.service.ts
import shopApi from "../clients/shop.client";
import { ApiParamsRequest, ApiResponse, ApiResponseError } from "../types/common";
import { ListCategoriesResponse } from "../types/category";

export const CategoryService = {
  async getCategories(params : ApiParamsRequest): Promise<ListCategoriesResponse> {
    const res = await shopApi.get<
      ApiResponse<ListCategoriesResponse> | ApiResponseError
    >("/categories", { params });

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
};
