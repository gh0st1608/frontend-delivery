import { useEffect, useState } from "react";
//import { OrderTracking } from "@/types/tracking";
import { orderTrackingMock } from "@/mocks/order-tracking";
//import { TrackingService } from "@/services/tracking.service";

export function useOrderTracking(orderId: string) {
  //const [data, setData] = useState<OrderTracking | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!orderId) return;

    const res = setTimeout(() => {
      setData(orderTrackingMock);
      setLoading(false);
    }, 600);

    /* const fetchTracking = async () => {
      try {
        const res = await TrackingService.getOrderTracking(orderId);
        setData(res);
      } finally {
        setLoading(false);
      }
    }; */

    /* fetchTracking();
    interval = setInterval(fetchTracking, 5000); */ // polling

    return () => clearInterval(res);
  }, [orderId]);

  return { data, loading };
}
