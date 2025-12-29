import { handleApiError } from "@/utils/error-handler";
import { AxiosInstance } from "axios";


export default function attachResponseInterceptor(api: AxiosInstance) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const handledError = await handleApiError(error);
      return Promise.reject(handledError);
    }
  );
}