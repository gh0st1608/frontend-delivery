import { useEffect, useRef, useState } from "react";
import { TrackingSocketService } from "@/api/socket/services/tracking.socket.service";
import { OrderTrackingSocketEvent } from "@/api/socket/types/order";
import { OrderService } from "@/api/http/services/order.service";
import { MapsService } from "@/api/http/services/maps.service";

type TrackingStatus = "WAITING" | "ASSIGNED" | "TRACKING";

export function useOrderTracking(orderId?: string) {
  const serviceRef = useRef<TrackingSocketService | null>(null);
  const lastRouteFetchRef = useRef<number>(0);

  const [status, setStatus] = useState<TrackingStatus>("WAITING");
  const [tracking, setTracking] =
    useState<OrderTrackingSocketEvent | null>(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState<[number, number][]>([]);

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;

    async function initialize() {
      if (!orderId) return;
      console.log('orderId',orderId)
      const service = new TrackingSocketService(orderId);
      serviceRef.current = service;
      service.connect();

      service.subscribeCourierAssigned(() => {
        setStatus("ASSIGNED");
      });

      service.subscribeTrackingUpdated(async (payload) => {
        setTracking(payload);
        setStatus("TRACKING");

        if (payload.phase === "DELIVERED") {
          setRouteCoordinates([]);
          return;
        }

        const now = Date.now();
        if (now - lastRouteFetchRef.current < 10000) return;
        lastRouteFetchRef.current = now;

        // 🔥 destino depende de la fase
        const destination =
          payload.phase === "TO_PICKUP"
            ? payload.pickup
            : payload.dropoff;

        try {
          const route = await MapsService.getRoute(
            payload.location,
            destination
          );

          if (isMounted && route.length > 1) {
            setRouteCoordinates(route);
          }
        } catch (error) {
          console.error("Route fetch failed", error);
        }
      });

      // snapshot inicial
      const {
        order: { statusDelivery },
      } = await OrderService.getOrderStatusDelivery(orderId);

      if (!isMounted) return;

      if (statusDelivery === "ASSIGNED") {
        setStatus("ASSIGNED");
      }
    }

    initialize();

    return () => {
      isMounted = false;
      serviceRef.current?.disconnect();
      serviceRef.current = null;
    };
  }, [orderId]);

  return {
    status,
    tracking,
    routeCoordinates,
  };
}
