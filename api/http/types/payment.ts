import { BaseResponse } from "./common";

export type PaymentStatus = "success" | "failure" | "pending";
export type PaymentProvider = "Paypal" | "Stripe" ;

// ----------- Payloads -----------
// El monto lo toma el backend de la orden: el cliente no lo envía
export interface CreatePaymentPaypalPayload {
  orderId: string;
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
    amountUsd: number;
    amountClp: number;
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
