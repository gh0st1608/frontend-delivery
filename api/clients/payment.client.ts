import axios from "axios";
import { CONFIG } from "@/constants/config";
import attachRequestInterceptor from "../interceptors/request";
import attachResponseInterceptor from "../interceptors/response";

const paymentApi = axios.create({
  baseURL: CONFIG.API_URL_PAYMENT,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

attachRequestInterceptor(paymentApi);
attachResponseInterceptor(paymentApi);

export default paymentApi;