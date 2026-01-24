import paymentApi from "../clients/payment.client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import {
  CreatePaymentPaypalPayload,
  CreatePaymentPaypalResponse,
  PaymentProvider,
} from "../types/payment";

export const PaymentService = {
  async createPaypalPayment(
    payload: CreatePaymentPaypalPayload
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
  async confirmPayment(payload: {
    token: string;
    PayerID: string;
    provider: PaymentProvider
  }) {
    const request = {
      Data: {
        Payment: payload,
      },
    };

    const res = await paymentApi.post("/confirm", request);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
};
