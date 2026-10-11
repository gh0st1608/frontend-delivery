import axios from "axios";
import { CONFIG } from "@/constants/config";
import attachRequestInterceptor from "../interceptors/request";
import attachResponseInterceptor from "../interceptors/response";
import { isWeb } from "@/utils/token-storage";

const authApi = axios.create({
  baseURL: CONFIG.API_URL_AUTH,
  timeout: 10000,
  // Web: el backend entrega el refresh token en una cookie HttpOnly
  withCredentials: isWeb,
  headers: { "Content-Type": "application/json" },
});

attachRequestInterceptor(authApi);
attachResponseInterceptor(authApi);

export default authApi;
