import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { DeliveryPhase } from "@/api/socket/types/order";
import {
  isPickupPhase,
  resolveTrackingDestination,
} from "@/utils/tracking-phase";
import "./leaflet.web.css";

type LatLngTuple = [number, number];

type Props = {
  phase: DeliveryPhase;
  courier: { lat: number; lng: number };
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  route: LatLngTuple[];
};

const courierIcon = new L.Icon({
  iconUrl: "/images/courier.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const pickupIcon = new L.Icon({
  iconUrl: "/images/pick-up.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const dropoffIcon = new L.Icon({
  iconUrl: "/icons/drop-off.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
}

export function MapRoute({
  phase,
  courier,
  pickup,
  dropoff,
  route,
}: Props) {
  const [position, setPosition] = useState<LatLngTuple>([
    courier.lat,
    courier.lng,
  ]);
  const prevPosition = useRef(position);
  const animationRef = useRef<number | null>(null);

  const destination = useMemo(() => {
    return resolveTrackingDestination(phase, pickup, dropoff);
  }, [phase, pickup, dropoff]);

  useEffect(() => {
    const from = prevPosition.current;
    const to: LatLngTuple = [courier.lat, courier.lng];
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / 1000, 1);
      const lat = from[0] + (to[0] - from[0]) * progress;
      const lng = from[1] + (to[1] - from[1]) * progress;

      setPosition([lat, lng]);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
    prevPosition.current = to;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [courier.lat, courier.lng]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%", borderRadius: 16 }}
      >
        <FixMapResize />

        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={courierIcon} />
        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
        <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon} />

        {route.length > 0 && destination && (
          <Polyline
            positions={route}
            pathOptions={{
              color: isPickupPhase(phase) ? "#3B82F6" : "#22C55E",
              weight: 4,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
