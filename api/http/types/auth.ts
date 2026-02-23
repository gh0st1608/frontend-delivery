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
}

// ----------- Responses -----------
export interface LoginResponse extends BaseResponse {
  Auth: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterResponse extends BaseResponse {
  Auth: {
    accessToken: string;
    refreshToken: string;
  };
}

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
