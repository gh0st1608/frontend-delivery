import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { useCategories } from "@/hooks/category/use-categories";
import { useAuth } from "@/hooks/use-auth";
import { PreferenceService } from "@/api/http/services/preference.service";

const MAX_CATEGORIES = 3;

export function useChooseCategory() {
  const { user, status, refreshUser } = useAuth();
  const { categories, loading, error, fetchCategories } = useCategories();

  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_CATEGORIES) return prev;
      return [...prev, id];
    });
  }, []);

  const canContinue =
    status === "onboardingRequired" && !!user && selected.length > 0 && !saving;

  const continueFlow = async () => {
    if (!canContinue || !user) return;

    try {
      setSaving(true);

      await PreferenceService.create({
        categoryIds: selected,
      });

      // refreshUser cambia el estado a "authenticated" y el layout redirige
      await refreshUser();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "No se pudieron guardar tus preferencias."
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    selected,
    saving,
    toggleCategory,
    continueFlow,
    canContinue,
  };
}
