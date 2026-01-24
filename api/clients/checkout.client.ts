import axios from "axios";
import { CONFIG } from "@/constants/config";
import attachRequestInterceptor from "../interceptors/request";
import attachResponseInterceptor from "../interceptors/response";

const authApi = axios.create({
  baseURL: CONFIG.API_URL_CHECKOUT,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

attachRequestInterceptor(authApi);
attachResponseInterceptor(authApi);

export default authApi;