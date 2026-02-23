import { Socket } from "socket.io-client";
import { CourierAssignedSocketEvent, OrderTrackingSocketEvent } from "../types/order";
import { createSocket } from "../clients/socket.client";
import { trackingChannel } from "../channels/tracking.channel";

export class TrackingSocketService {
  private socket: Socket;
  private channel;
  private readonly orderId: string;

  private assignedListener?: (payload: CourierAssignedSocketEvent) => void;
  private trackingListener?: (payload: OrderTrackingSocketEvent) => void;

  constructor(orderId: string) {
    this.orderId = orderId;

    this.socket = createSocket({
      role: "consumer",
    });

    this.channel = trackingChannel(this.socket);
  }

  connect() {
    if (this.socket.connected) return;

    this.socket.connect();

    this.socket.on("connect", () => {
      console.log("🟢 Connected:", this.socket.id);

      this.socket.emit("order.tracking.join", {
        orderId: this.orderId,
      });
    });
  }

  // 👤 Escuchar cuando se asigna courier
  subscribeCourierAssigned(cb: (payload: CourierAssignedSocketEvent) => void) {
    this.assignedListener = (payload) => {
      if (payload.orderId !== this.orderId) return;
      cb(payload);
    };

    this.channel.onCourierAssigned(this.assignedListener);
  }

  // 🛵 Escuchar updates de ubicación
  subscribeTrackingUpdated(cb: (payload: OrderTrackingSocketEvent) => void) {
    this.trackingListener = (payload) => {
      if (payload.orderId !== this.orderId) return;
      cb(payload);
    };

    this.channel.onTrackingUpdated(this.trackingListener);
  }

  disconnect() {
    this.socket.emit("order.tracking.leave", {
      orderId: this.orderId,
    });

    if (this.assignedListener) {
      this.channel.offCourierAssigned(this.assignedListener);
    }

    if (this.trackingListener) {
      this.channel.offTrackingUpdated(this.trackingListener);
    }

    this.socket.disconnect();
  }
}
