import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocationSearchInput } from "./location-search-input.web";

interface Props {
  lat?: number;
  lng?: number;
  onSelect: (lat: number, lng: number) => void;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
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

  const handleLocationFound = (
    lat: number,
    lng: number
  ) => {
    setPosition([lat, lng]);
    onSelect(lat, lng);
  };

  return (
    <div>
      <LocationSearchInput
        onLocationFound={handleLocationFound}
      />

      <div style={{ height: 300, borderRadius: 16, overflow: "hidden" }}>
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ChangeView center={position} />

          <MapClickHandler
            onSelect={(lat, lng) => {
              setPosition([lat, lng]);
              onSelect(lat, lng);
            }}
          />

          <Marker
            position={position}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const { lat, lng } =
                  marker.getLatLng();
                setPosition([lat, lng]);
                onSelect(lat, lng);
              },
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
