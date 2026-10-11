import { AxiosInstance } from "axios";
import { TokenStorage, isWeb } from "@/utils/token-storage";

export default function attachRequestInterceptor(api: AxiosInstance) {
  api.interceptors.request.use((config) => {
    // El access token vive solo en memoria
    const token = TokenStorage.getAccessToken();

    config.headers = config.headers ?? {};
    config.headers["X-Client-Type"] = isWeb ? "web" : "mobile";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}
