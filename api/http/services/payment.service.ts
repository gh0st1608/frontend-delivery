import paymentApi from "../clients/payment.client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import {
  ConfirmPaymentPaypalPayload,
  ConfirmPaymentPaypalResponse,
  CreatePaymentPaypalPayload,
  CreatePaymentPaypalResponse,
} from "../types/payment";

export const PaymentService = {
  async createPaypalPayment(
    payload: CreatePaymentPaypalPayload,
  ): Promise<CreatePaymentPaypalResponse> {
    const request: ApiRequest<{ Payment: CreatePaymentPaypalPayload }> = {
      Data: {
        Payment: payload,
      },
    };

    const res = await paymentApi.post<
      ApiResponse<CreatePaymentPaypalResponse> | ApiResponseError
    >("/paypal", request);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  async confirmPayment(
    payload: ConfirmPaymentPaypalPayload,
  ): Promise<ConfirmPaymentPaypalResponse> {
    const request: ApiRequest<{ Payment: ConfirmPaymentPaypalPayload }> = {
      Data: {
        Payment: payload,
      },
    };

    const res = await paymentApi.post<
      ApiResponse<ConfirmPaymentPaypalResponse>  | ApiResponseError
    >("/confirm", request);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
};
