import { BaseResponse } from "./common";
import { User } from "./user";

// ----------- Payloads -----------
export interface LoginPayload {
  authType: string;
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export interface SetPasswordPayload {
  email: string;
  password: string;
  code: string;
}

// ----------- Responses -----------
// refreshToken solo llega en móvil; en web viaja en una cookie HttpOnly
export interface LoginResponse extends BaseResponse {
  Auth: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  };
}

export type RegisterResponse = LoginResponse;

export interface VerifyEmailResponse extends BaseResponse {
  User: { 
    verifyEmail: boolean 
  };
}

export interface MeResponse {
  user: User;
}

export type AuthStatus =
  | "checking"
  | "unauthenticated"
  | "authenticated"
  | "emailVerified"
  | "passwordRequired"
  | "onboardingRequired";
