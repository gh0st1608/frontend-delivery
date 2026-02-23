import { CONFIG } from "@/constants/config";
import axios from "axios";

const mapsApi = axios.create({
  baseURL: CONFIG.API_URL_GOOGLE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default mapsApi;
