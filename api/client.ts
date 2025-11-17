import axios from "axios";
import { CONFIG } from "@/constants/config";
import attachRequestInterceptor from "./interceptors/request";
import attachResponseInterceptor from "./interceptors/response";

const api = axios.create({
  baseURL: CONFIG.API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 👉 Inferimos el tipo correcto automáticamente
export type ApiClient = typeof api;

attachRequestInterceptor(api);
attachResponseInterceptor(api);

export default api;