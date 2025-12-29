import authApi from "../clients/auth.client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import {
  CreatePreferencePayload,
  CreatePreferenceResponse,
} from "../types/preference";

export const PreferenceService = {
    async create(payload: CreatePreferencePayload): Promise<CreatePreferenceResponse> {
    const request: ApiRequest<{ Preference: CreatePreferencePayload }> = {
      Data: {
        Preference: payload,
      },
    };

    const res = await authApi.post<ApiResponse<CreatePreferenceResponse> | ApiResponseError>(
      "/preferences",
      request
    );

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
}