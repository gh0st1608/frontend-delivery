import { Socket } from "socket.io-client";
import { CourierAssignedSocketEvent, OrderTrackingSocketEvent } from "../types/order";

export function trackingChannel(socket: Socket) {
  return {
    onTrackingUpdated(cb: (data: OrderTrackingSocketEvent) => void) {
      socket.on("order.tracking.updated", cb);
    },

    offTrackingUpdated(cb: (data: OrderTrackingSocketEvent) => void) {
      socket.off("order.tracking.updated", cb);
    },

    onCourierAssigned(cb: (data: CourierAssignedSocketEvent) => void) {
      socket.on("order.courier.assigned", cb);
    },

    offCourierAssigned(cb: (data: CourierAssignedSocketEvent) => void) {
      socket.off("order.courier.assigned", cb);
    },
  };
}
