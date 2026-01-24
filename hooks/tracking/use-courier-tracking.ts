import { useEffect, useState } from "react";
//import { CourierTracking } from "@/types/tracking";
import { courierTrackingMock } from "@/mocks/courier-tracking";
//import { TrackingService } from "@/services/tracking.service";

export function useCourierTracking(orderId: string) {
  //const [data, setData] = useState<CourierTracking | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    // ⏱️ Simula request al backend
    const res = setTimeout(() => {
      setData(courierTrackingMock);
      setLoading(false);
    }, 800);
    /* const interval = setInterval(async () => {
      const res = await TrackingService.getCourierTracking(orderId);
      setData(res);
    }, 3000); */

    return () => clearInterval(res);
  }, [orderId]);

  return { data, loading };
}
