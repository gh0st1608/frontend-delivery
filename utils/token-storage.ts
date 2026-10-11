import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// OWASP MASVS:
// - Access token: solo en memoria (vida corta, se renueva con el refresh token).
// - Refresh token móvil: almacenamiento seguro del SO (Keychain / Keystore).
// - Refresh token web: cookie HttpOnly gestionada por el backend; JavaScript
//   nunca lo ve, así un XSS no puede robarlo.

const REFRESH_TOKEN_KEY = "fs_refresh_token";
const LEGACY_KEYS = ["access_token", "refresh_token", "auth_token"];

export const isWeb = Platform.OS === "web";

let accessToken: string | null = null;

export const TokenStorage = {
  getAccessToken: () => accessToken,

  setAccessToken: (token: string | null) => {
    accessToken = token;
  },

  async getRefreshToken(): Promise<string | null> {
    if (isWeb) return null;
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setRefreshToken(token?: string | null) {
    if (isWeb || !token) return;
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  async clear() {
    accessToken = null;
    if (!isWeb) {
      try {
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      } catch {
        // nada que borrar
      }
    }
    // Versiones anteriores guardaban tokens en AsyncStorage (texto plano)
    await AsyncStorage.multiRemove(LEGACY_KEYS).catch(() => undefined);
  },
};
