import axios from "axios";
import { CONFIG } from "@/constants/config";
import { TokenStorage, isWeb } from "@/utils/token-storage";
import { ApiRequest, ApiResponse } from "./types/common";
import { LoginResponse } from "./types/auth";

// Cliente sin interceptores: el refresh nunca debe disparar otro refresh
const sessionApi = axios.create({
  baseURL: CONFIG.API_URL_AUTH,
  timeout: 10000,
  // Web: el refresh token viaja en una cookie HttpOnly
  withCredentials: isWeb,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Type": isWeb ? "web" : "mobile",
  },
});

let refreshInFlight: Promise<string> | null = null;

/**
 * Renueva el access token. Single-flight: si varias peticiones reciben 401 a la
 * vez, todas esperan el mismo refresh. Es importante porque el backend rota el
 * refresh token y trata un segundo uso del mismo token como robo (revoca la sesión).
 */
export function refreshSession(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function doRefresh(): Promise<string> {
  const refreshToken = await TokenStorage.getRefreshToken();

  // Móvil sin refresh token guardado: no hay sesión que renovar
  if (!isWeb && !refreshToken) {
    throw new Error("Sin sesión");
  }

  const request: ApiRequest<{ Auth: { refreshToken?: string } }> = {
    Data: { Auth: refreshToken ? { refreshToken } : {} },
  };

  const res = await sessionApi.post<ApiResponse<LoginResponse>>(
    "/refresh",
    request,
  );

  await storeSession(res.data.Data);
  return res.data.Data.Auth.accessToken;
}

export async function storeSession(data: LoginResponse) {
  TokenStorage.setAccessToken(data.Auth.accessToken);
  await TokenStorage.setRefreshToken(data.Auth.refreshToken);
}

// Revoca la sesión en el servidor (toda la familia de refresh tokens)
export async function revokeSession() {
  try {
    const refreshToken = await TokenStorage.getRefreshToken();
    await sessionApi.post("/logout", {
      Data: { Auth: refreshToken ? { refreshToken } : {} },
    });
  } catch {
    // Aunque falle la red, localmente la sesión se elimina igual
  } finally {
    await TokenStorage.clear();
  }
}
