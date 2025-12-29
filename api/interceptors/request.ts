import { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function attachRequestInterceptor(api: AxiosInstance) {
  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}
