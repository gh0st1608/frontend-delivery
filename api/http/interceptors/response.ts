import { handleApiError } from "@/utils/error-handler";
import { SessionEvents } from "@/utils/session-events";
import { TokenStorage } from "@/utils/token-storage";
import { refreshSession } from "../session";
import { AxiosInstance } from "axios";

export default function attachResponseInterceptor(api: AxiosInstance) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      // Access token vencido: se renueva una vez y se reintenta la petición
      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;

        try {
          const token = await refreshSession();
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        } catch {
          // Refresh inválido/revocado: la sesión terminó
          await TokenStorage.clear();
          SessionEvents.emitUnauthorized();
        }
      }

      const handledError = await handleApiError(error);
      return Promise.reject(handledError);
    }
  );
}
