import type { ApiClient } from "../client";
import { handleApiError } from "@/utils/error-handler";

export default function attachResponseInterceptor(api: ApiClient) {
  api.interceptors.response.use(
    response => response,
    async (error) => {
      const handled = await handleApiError(error);
      return Promise.reject(handled);
    }
  );
}
