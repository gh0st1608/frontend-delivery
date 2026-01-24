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


// ----------- Responses -----------

export interface CreatePaymentPaypalResponse extends BaseResponse {
  payment : {
    paymentId: string;
    redirectUrl : string
  }
}
