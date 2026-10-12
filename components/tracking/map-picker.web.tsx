import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "./leaflet.web.css";
import { LocationSearchInput } from "./location-search-input.web";

interface Props {
  lat?: number;
  lng?: number;
  onSelect: (lat: number, lng: number) => void;
}

const pickerIcon = new L.Icon({
  iconUrl: "/icons/drop-off.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Recentra el mapa y corrige su tamaño cuando cambia la posición o el layout
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center[0], center[1]]);
  useEffect(() => {
    // Leaflet necesita recalcular su tamaño dentro de contenedores flex
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, []);
  return null;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapPicker({ lat, lng, onSelect }: Props) {
  const [position, setPosition] = useState<[number, number]>([
    lat ?? -12.0464,
    lng ?? -77.0428,
  ]);

  const select = (la: number, ln: number) => {
    setPosition([la, ln]);
    onSelect(la, ln);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Buscador flotante sobre el mapa */}
      <div style={{ position: "relative", zIndex: 1000, padding: "0 4px 12px" }}>
        <LocationSearchInput onLocationFound={(la, ln) => select(la, ln)} />
      </div>

      {/* Mapa */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 260,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid #EDEDED",
          boxShadow: "0 8px 24px rgba(17,24,39,0.10)",
        }}
      >
        <MapContainer center={position} zoom={16} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={position} />
          <MapClickHandler onSelect={select} />
          <Marker
            position={position}
            icon={pickerIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat: la, lng: ln } = e.target.getLatLng();
                select(la, ln);
              },
            }}
          />
        </MapContainer>

        {/* Ayuda flotante */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 14,
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "rgba(17,24,39,0.82)",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 500,
            padding: "7px 14px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          Arrastra el pin o toca el mapa para ajustar
        </div>
      </div>
    </div>
  );
}
