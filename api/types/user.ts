import { BaseResponse } from "./common";
// ----------- Payloads -----------



// ----------- Responses -----------
export interface ListUsersResponse extends BaseResponse {
  items: User[];
  nextCursor: string;
}

export interface GetUserByIdResponse extends BaseResponse {
  user: User
}

export interface User {
  userId: string;
  name: string;
  lastname: boolean;
  email: boolean;
  password: boolean;
  onboardingRequired: boolean;
  image: string;
  active: boolean;
}
