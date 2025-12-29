// Tipos genéricos usados por toda la API

export interface BaseResponse {
  statusCode: number;
  message: string;
}

export interface ApiRequest<T> {
  Data: T;
}

export interface ApiResponse<T> {
  Data: BaseResponse & T;
}

export interface BaseResponseError {
  code: number;
  status: string;
  dateTime: string;
  title: string;
  message: string;
}

export interface ApiResponseError {
  Data: null;
  Error: BaseResponseError;
}

export interface ApiParamsRequest {
  search?: string;
  limit: number;
  cursor?: string;
}


