import { BaseResponse } from "./common";
// ----------- Payloads -----------



// ----------- Responses -----------
export interface ListProductsResponse extends BaseResponse {
  items: Product[];
  nextCursor: string;
}

export interface GetProductByIdResponse extends BaseResponse {
  product: Product
}

export interface Product {
  active: boolean;
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  sku: string;
  ingredients: IngredientDetail[]
}

export interface IngredientDetail {
  name: string;
/*   isAllergen: boolean; */
  quantity: number;
  unit: string;
  image?: string;
}
