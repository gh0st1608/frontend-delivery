import api from "../client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  VerifyCodePayload,
} from "../types/auth";

export const AuthService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const request: ApiRequest<{ Auth: LoginPayload }> = {
      Data: { Auth: payload },
    };

    const res = await api.post<ApiResponse<LoginResponse> | ApiResponseError>(
      "/auth/login",
      request
    );

    // Atención: Axios captura errores HTTP, pero si tu API devuelve 200 con Error,
    // igual debemos validarlo manualmente
    if ("Error" in res.data) {
      throw res.data.Error; // lanza BaseResponseError
    }

    return res.data.Data; // solo Data limpia
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const request: ApiRequest<{ User: RegisterPayload }> = {
      Data: {
        User: payload,
      },
    };

    const res = await api.post<ApiResponse<RegisterResponse> | ApiResponseError>(
      "/auth/register",
      request
    );

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },

  async verifyEmail(payload: VerifyEmailPayload) {
    const request: ApiRequest<{ User: VerifyEmailPayload }> = {
      Data: {
        User: payload,
      },
    };

    const res = await api.post<
      ApiResponse<VerifyEmailResponse> | ApiResponseError
    >("/auth/verify-email", request);

    // Validamos si la respuesta es un error
    if ("Error" in res.data) {
      throw res.data.Error; // Lanzas directamente el error tipado
    }

    // Si llegas aquí, es un OK
    return res.data.Data;
  },

  async verifyCode(payload: VerifyCodePayload) {
    const request: ApiRequest<{ User: VerifyCodePayload }> = {
      Data: {
        User: payload,
      },
    };

    const res = await api.post<
      ApiResponse<VerifyEmailResponse> | ApiResponseError
    >("/auth/verify-email", request);

    // Validamos si la respuesta es un error
    if ("Error" in res.data) {
      throw res.data.Error; // Lanzas directamente el error tipado
    }

    // Si llegas aquí, es un OK
    return res.data.Data;
  },
};
