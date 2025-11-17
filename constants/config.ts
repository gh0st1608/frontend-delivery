import Constants from "expo-constants";

const { API_URL } = Constants.expoConfig?.extra || {};

export const CONFIG = {
  API_URL: API_URL || "https://mi-backend.com/api", // fallback por si falta
};
