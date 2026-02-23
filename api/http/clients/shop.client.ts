import axios from "axios";
import { CONFIG } from "@/constants/config";
import attachRequestInterceptor from "../interceptors/request";
import attachResponseInterceptor from "../interceptors/response";

const shopApi = axios.create({
  baseURL: CONFIG.API_URL_SHOP,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

attachRequestInterceptor(shopApi);
attachResponseInterceptor(shopApi);

export default shopApi;
