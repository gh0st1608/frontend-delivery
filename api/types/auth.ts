import { BaseResponse } from "./common";

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
  codeMailing: string;
}

// ----------- Responses -----------
export interface LoginResponse extends BaseResponse {
  Auth: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterResponse extends BaseResponse {
  User: {
    id: string;
    email: string;
  };
}

export interface VerifyEmailResponse extends BaseResponse {
  User: { 
    verifyEmail: boolean 
  };
}
