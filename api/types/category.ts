import { BaseResponse } from "./common";
// ----------- Payloads -----------



// ----------- Responses -----------
export interface ListCategoriesResponse extends BaseResponse {
  items: Category[];
  nextCursor: string;
}

export interface GetCategoryByIdResponse extends BaseResponse {
  category: Category
}

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  image: string;
  active: boolean;
}
