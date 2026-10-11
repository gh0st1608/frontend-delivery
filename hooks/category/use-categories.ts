import { useCallback, useState } from "react";
import { Category } from "@/api/http/types/category";
import { CategoryService } from "@/api/http/services/category.service";
import { ApiParamsRequest } from "@/api/http/types/common";

const DEFAULT_PARAMS: ApiParamsRequest = {
  search: "",
  limit: 10,
  cursor: "",
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(
    async (params: Partial<ApiParamsRequest> = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await CategoryService.getCategories({
          ...DEFAULT_PARAMS,
          ...params,
        });

        setCategories(response.items);
      } catch (err) {
        console.error("❌ Error loading categories", err);
        setError("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { categories, loading, error, fetchCategories };
}
