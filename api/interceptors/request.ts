import type { ApiClient } from "../client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function attachRequestInterceptor(api: ApiClient) {
  api.interceptors.request.use(async (config : any) => {
    const token = await AsyncStorage.getItem("access_token");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  });
}
