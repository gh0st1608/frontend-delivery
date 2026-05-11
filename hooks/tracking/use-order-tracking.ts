import { useEffect, useRef, useState } from "react";
import { TrackingSocketService } from "@/api/socket/services/tracking.socket.service";
import { OrderTrackingSocketEvent } from "@/api/socket/types/order";
import { OrderService } from "@/api/http/services/order.service";
import { MapsService } from "@/api/http/services/maps.service";

export type TrackingStatus =
  | "WAITING"
  | "ASSIGNED"
  | "TRACKING"
  | "DELIVERED";

function mapDeliveryStatus(status: string): TrackingStatus {
  switch (status) {
    case "CREATED":
      return "WAITING";

    case "ASSIGNED":
    case "PREPARING":
      return "ASSIGNED";

    case "PICKED_UP":
    case "ON_THE_WAY":
      return "TRACKING";

    case "DELIVERED":
      return "DELIVERED";

    default:
      return "WAITING";
  }
}

export function useOrderTracking(orderId?: string) {
  const serviceRef = useRef<TrackingSocketService | null>(null);
  const lastRouteFetchRef = useRef<number>(0);

  const [status, setStatus] = useState<TrackingStatus>("WAITING");
  const [tracking, setTracking] = useState<OrderTrackingSocketEvent | null>(
    null,
  );

  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    [],
  );

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;

    async function initialize() {
      if (!orderId) return;
      const service = new TrackingSocketService(orderId);
      serviceRef.current = service;

      service.connect();

      service.subscribeCourierAssigned(() => {
        if (!isMounted) return;
        setStatus("ASSIGNED");
      });

      service.subscribeTrackingUpdated(async (payload) => {
        if (!isMounted) return;

        let address = payload.dropoff.address;
        let city = payload.dropoff.city;

        try {
          if (!address && !city) {
            const reverse = await MapsService.reverseGeocode(
              payload.dropoff.lat,
              payload.dropoff.lng,
            );

            city = reverse.city;
            address = reverse.fullAddress;
          }
        } catch (error) {
          console.warn("Reverse geocode failed", error);
        }

        const enrichedTracking: OrderTrackingSocketEvent = {
          ...payload,
          dropoff: {
            ...payload.dropoff,
            city,
            address,
          },
        };

        setTracking(enrichedTracking);

        if (payload.phase === "DELIVERED") {
          setStatus("DELIVERED");
          setRouteCoordinates([]);
          return;
        }

        setStatus("TRACKING");

        const now = Date.now();

        if (now - lastRouteFetchRef.current < 10000) return;

        lastRouteFetchRef.current = now;

        const destination =
          payload.phase === "TO_PICKUP" ? payload.pickup : payload.dropoff;

        try {
          const route = await MapsService.getRoute(
            payload.location,
            destination,
          );

          if (route.length > 1) {
            setRouteCoordinates(route);
          }
        } catch (error) {
          console.error("Route fetch failed", error);
        }
      });

      // SNAPSHOT INICIAL
      try {
        const {
          order: { statusDelivery },
        } = await OrderService.getOrderStatusDelivery(orderId);

        if (!isMounted) return;

        setStatus(mapDeliveryStatus(statusDelivery));
      } catch (error) {
        console.error("Initial order status fetch failed", error);
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