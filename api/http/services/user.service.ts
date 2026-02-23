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
} from "../types/auth";

export const UserService = {
}