import { useState, useCallback } from "react";
import { ProductService } from "@/api/http/services/product.service";
import { ApiParamsRequest } from "@/api/http/types/common";
import { Product } from "@/api/http/types/product";

const DEFAULT_PARAMS: ApiParamsRequest = {
  search: "",
  limit: 10,
  cursor: "",
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (params: Partial<ApiParamsRequest> = {}) => {
      try {
        setLoading(true);
        setError(null);

        const data = await ProductService.getProducts({
          ...DEFAULT_PARAMS,
          ...params,
        });
        console.log('data',data)
        setProducts(data.items);
      } catch (err) {
        console.error("❌ Error loading products", err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
};
