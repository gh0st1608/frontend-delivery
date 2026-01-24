import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
//import "leaflet/dist/leaflet.css";

type Props = {
  courier: { lat: number; lng: number };
  destination: { lat: number; lng: number };
};

// 🧭 Icono custom (opcional pero recomendado)
const courierIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
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

export function MapRoute({ courier, destination }: Props) {
  const [position, setPosition] = useState<[number, number]>([
    courier.lat,
    courier.lng,
  ]);

  const prevPosition = useRef(position);
  const animationRef = useRef<number | null>(null);

  // 🚗 Animación suave del courier
  const animateTo = (
    from: [number, number],
    to: [number, number],
    duration = 1000
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

  // 🔄 Reaccionar a cambios del courier
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

      {/* 🚗 Courier animado */}
      <Marker position={position} icon={courierIcon} />

      {/* 📍 Destino */}
      <Marker position={[destination.lat, destination.lng]} />

      {/* 🛣️ Ruta (mock) */}
      <Polyline
        positions={[
          position,
          [destination.lat, destination.lng],
        ]}
        pathOptions={{ color: "#22C55E", weight: 4 }}
      />
    </MapContainer>
  </div>
  );
}
