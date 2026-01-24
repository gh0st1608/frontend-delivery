import axios from "axios";
import { CONFIG } from "@/constants/config";
import attachRequestInterceptor from "../interceptors/request";
import attachResponseInterceptor from "../interceptors/response";

const orderApi = axios.create({
  baseURL: CONFIG.API_URL_ORDER,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

attachRequestInterceptor(orderApi);
attachResponseInterceptor(orderApi);

export default orderApi;