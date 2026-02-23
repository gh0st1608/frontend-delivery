import React, { useState } from "react";
import { useGeocoding } from "@/hooks/tracking/use-geocoding";

interface Props {
  onLocationFound: (lat: number, lng: number, address: string) => void;
}

export function LocationSearchInput({
  onLocationFound,
}: Props) {
  const [query, setQuery] = useState("");
  const { geocode, loading } = useGeocoding();

  const handleSearch = async () => {
    if (!query) return;

    const result = await geocode(query);
    if (result) {
      onLocationFound(result.lat, result.lng, query);
    }
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your address"
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        style={{
          marginTop: 6,
          padding: 8,
          borderRadius: 8,
          border: "none",
          background: "#000",
          color: "#fff",
          width: "100%",
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
