import { useEffect, useRef, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "./leaflet.web.css";

type LatLngTuple = [number, number];

type DeliveryPhase = "TO_PICKUP" | "TO_DROPOFF" | "DELIVERED";

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

  // 🎯 Determinar destino según fase
  const destination = useMemo(() => {
    if (phase === "TO_PICKUP") return pickup;
    if (phase === "TO_DROPOFF") return dropoff;
    return null;
  }, [phase, pickup, dropoff]);

  // 🚗 Animación suave
  const animateTo = (
    from: LatLngTuple,
    to: LatLngTuple,
    duration = 1000,
  ) => {
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);

      const lat = from[0] + (to[0] - from[0]) * progress;
      const lng = from[1] + (to[1] - from[1]) * progress;

      setPosition([lat, lng]);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    animateTo(prevPosition.current, [courier.lat, courier.lng]);
    prevPosition.current = [courier.lat, courier.lng];

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

        {/* 🚗 Courier */}
        <Marker position={position} icon={courierIcon}></Marker>
        
        

        {/* 📦 Pickup */}
        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />

        {/* 🏠 Dropoff */}
        <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon} />

        {/* 🎯 Ruta activa */}
        {route.length > 0 && destination && (
          <Polyline
            positions={route}
            pathOptions={{
              color: phase === "TO_PICKUP" ? "#3B82F6" : "#22C55E",
              weight: 4,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
