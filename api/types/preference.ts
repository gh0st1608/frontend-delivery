import { BaseResponse } from "./common";
// ----------- Payloads -----------
export interface CreatePreferencePayload {
  userId: string;
  categoryIds: string[];
}


// ----------- Responses -----------
export interface CreatePreferenceResponse extends BaseResponse {
  preference : {
    ids : string[]
  }
}

export interface ListPreferencesResponse extends BaseResponse {
  items: Preference[];
  nextCursor: string;
}

export interface GetPreferenceByIdResponse extends BaseResponse {
  preference: Preference
}

export interface Preference {
  userId: string;
  categoryId: string;
  active: boolean;
}
