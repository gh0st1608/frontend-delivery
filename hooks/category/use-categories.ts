import { useCallback, useState } from "react";
import { Category } from "@/api/types/category";
import { CategoryService } from "@/api/services/category.service";
import { ApiParamsRequest } from "@/api/types/common";

const DEFAULT_PARAMS: ApiParamsRequest = {
  search: "",
  limit: 10,
  cursor: "",
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(
    async (params: Partial<ApiParamsRequest> = {}) => {
      try {
        setLoading(true);
        const response = await CategoryService.getCategories({
          ...DEFAULT_PARAMS,
          ...params,
        });

        setCategories(response.items);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { categories, loading, fetchCategories };
}
