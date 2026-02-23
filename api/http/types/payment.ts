import { BaseResponse } from "./common";

export type PaymentStatus = "success" | "failure" | "pending";
export type PaymentProvider = "Paypal" | "Stripe" ;

// ----------- Payloads -----------
export interface CreatePaymentPaypalPayload {
  orderId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  successUrl: string;
  cancelUrl: string;
}

export interface ConfirmPaymentPaypalPayload {
  token: string;
  PayerID: string;
  provider: string;
}


// ----------- Responses -----------

export interface CreatePaymentPaypalResponse extends BaseResponse {
  payment : {
    providerOrderId: string;
    redirectUrl : string;
    paymentId: string;
  }
}

export interface ConfirmPaymentPaypalResponse extends BaseResponse {
  payment : {
    orderId: string;
    paymentId: string;
    providerPaymentId : string;
    providerPaymentStatus: string;
  }
}
