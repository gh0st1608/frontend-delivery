import { useCallback, useState } from "react";
import { Product } from "@/api/types/product";
import { ProductService } from "@/api/services/product.service";

export function useProductDetail() {
  const [productDetail, setProductDetail] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetail = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { product } = await ProductService.getProductById(productId);
      setProductDetail(product);
    } catch (err) {
      setError("Error loading product details");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    productDetail,
    loading,
    error,
    fetchProductDetail,
  };
}
