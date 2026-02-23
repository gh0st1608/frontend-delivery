// hooks/bookmark/use-bookmarks.ts
import { useCallback, useState } from "react";
import { Product } from "@/api/http/types/product";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Product[]>([]);
  const [query, setQuery] = useState("");

  const toggleBookmark = useCallback((product: Product) => {
    setBookmarks((prev) =>
      prev.some((p) => p.productId === product.productId)
        ? prev.filter((p) => p.productId !== product.productId)
        : [...prev, product]
    );
  }, []);

  const filtered = bookmarks.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return {
    bookmarks: filtered,
    query,
    setQuery,
    toggleBookmark,
  };
}
