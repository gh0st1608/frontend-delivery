import orderApi from "../clients/order.client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  GetOrderByIdResponse,
  GetOrderStatusDeliveryResponse,
  ConfirmDeliveryResponse,
  PricingResponse,
} from "../types/order";

export const OrderService = {
  async getOrderStatusDelivery(orderId: string) : Promise<GetOrderStatusDeliveryResponse> {
    const res = await orderApi.get<
      ApiResponse<GetOrderStatusDeliveryResponse> | ApiResponseError
    >(`/${orderId}/status-delivery`);
    if ("Error" in res.data) {
      throw res.data.Error;
    }
    return res.data.Data;
  },

  async getOrderById(orderId: string): Promise<GetOrderByIdResponse> {
    const res = await orderApi.get<
      ApiResponse<GetOrderByIdResponse> | ApiResponseError
    >(`/${orderId}`);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  // El cliente confirma que recibió su pedido
  async confirmDelivery(orderId: string): Promise<ConfirmDeliveryResponse> {
    const res = await orderApi.patch<
      ApiResponse<ConfirmDeliveryResponse> | ApiResponseError
    >(`/${orderId}/confirm-delivery`);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  // Tarifa de envío (CLP) y tipo de cambio vigentes para el resumen
  async getPricing(): Promise<PricingResponse> {
    const res = await orderApi.get<
      ApiResponse<PricingResponse> | ApiResponseError
    >("/pricing");

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const request: ApiRequest<{ Order: CreateOrderPayload }> = {
      Data: {
        Order: payload,
      },
    };

    const res = await orderApi.post<
      ApiResponse<CreateOrderResponse> | ApiResponseError
    >("", request);

    if ("Error" in res.data) {
      throw res.data.Error;
    }

    return res.data.Data;
  },
};
