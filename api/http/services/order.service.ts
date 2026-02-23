import orderApi from "../clients/order.client";
import { ApiRequest, ApiResponse, ApiResponseError } from "../types/common";
import { CreateOrderPayload, CreateOrderResponse, GetOrderStatusDeliveryResponse, ListOrdersResponse } from "../types/order";

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

  async getOrderById(orderId: string): Promise<ListOrdersResponse> {
    const res = await orderApi.get<
      ApiResponse<ListOrdersResponse> | ApiResponseError
    >(`/${orderId}`);

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
