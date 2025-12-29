import authApi from "../clients/auth.client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  VerifyCodePayload,
  SetPasswordPayload,
  MeResponse,
} from "../types/auth";

export const AuthService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const request: ApiRequest<{ Auth: LoginPayload }> = {
      Data: { Auth: payload },
    };

    const res = await authApi.post<ApiResponse<LoginResponse> | ApiResponseError>(
      "/login",
      request
    );

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const request: ApiRequest<{ User: RegisterPayload }> = {
      Data: {
        User: payload,
      },
    };

    const res = await authApi.post<ApiResponse<RegisterResponse> | ApiResponseError>(
      "/register",
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

    const res = await authApi.post<
      ApiResponse<VerifyEmailResponse> | ApiResponseError
    >("/verify-email", request);

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

    const res = await authApi.post<
      ApiResponse<VerifyEmailResponse> | ApiResponseError
    >("/verify-code", request);

    // Validamos si la respuesta es un error
    if ("Error" in res.data) {
      throw res.data.Error; // Lanzas directamente el error tipado
    }

    // Si llegas aquí, es un OK
    return res.data.Data;
  },

  async setPassword(payload: SetPasswordPayload) {
    const request: ApiRequest<{ User: SetPasswordPayload }> = {
      Data: {
        User: payload,
      },
    };

    const res = await authApi.post<
      ApiResponse<VerifyEmailResponse> | ApiResponseError
    >("/set-password", request);

    // Validamos si la respuesta es un error
    if ("Error" in res.data) {
      throw res.data.Error; // Lanzas directamente el error tipado
    }

    // Si llegas aquí, es un OK
    return res.data.Data;
  },
  
  async me(): Promise<MeResponse> {
    const res = await authApi.get<ApiResponse<MeResponse> | ApiResponseError>(
      "/me"
    );

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  
};
