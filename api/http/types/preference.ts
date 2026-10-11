import { BaseResponse } from "./common";
// ----------- Payloads -----------
// El usuario lo determina el backend a partir del access token
export interface CreatePreferencePayload {
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
