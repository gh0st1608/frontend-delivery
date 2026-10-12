import {
  GeocodeResult,
  ReverseGeocodeResult,
  AddressSuggestion,
  NominatimPlace,
  NominatimAddress,
  OsrmResponse,
} from "@/api/http/types/maps";

// Geocodificación con Nominatim (OpenStreetMap): gratis, sin API key ni
// facturación, y coherente con el mapa (que usa tiles de OSM).
// Política de uso: máx. 1 petición/segundo (el autocompletado va con debounce).
// En producción conviene un proveedor con SLA o un Nominatim propio.
const NOMINATIM = "https://nominatim.openstreetmap.org";
const LANG = "es";

async function nominatim<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams({
    format: "jsonv2",
    "accept-language": LANG,
    ...params,
  }).toString();

  // El navegador no permite fijar User-Agent (usa el Referer); en nativo sí.
  const res = await fetch(`${NOMINATIM}${path}?${qs}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Nominatim ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Ciudad y calle legibles a partir del detalle de Nominatim
function toReadable(place: NominatimPlace): ReverseGeocodeResult {
  const a: NominatimAddress = place.address ?? {};
  const city = a.city || a.town || a.village || a.suburb || a.state || "";
  const street =
    [a.road, a.house_number].filter(Boolean).join(" ") ||
    a.neighbourhood ||
    a.suburb ||
    place.display_name.split(",")[0];

  return { city, street, fullAddress: place.display_name };
}

export const MapsService = {
  // Busca varias coincidencias (para el autocompletado)
  async searchAddresses(query: string): Promise<AddressSuggestion[]> {
    const q = query.trim();
    if (q.length < 3) return [];

    const places = await nominatim<NominatimPlace[]>("/search", {
      q,
      addressdetails: "1",
      limit: "6",
    });

    return places.map((p) => {
      const { city, street, fullAddress } = toReadable(p);
      return {
        lat: Number(p.lat),
        lng: Number(p.lon),
        label: fullAddress,
        city,
        street,
      };
    });
  },

  // Dirección -> coordenadas (primera coincidencia)
  async geocodeAddress(address: string): Promise<GeocodeResult> {
    const places = await nominatim<NominatimPlace[]>("/search", {
      q: address,
      limit: "1",
    });

    if (!places.length) {
      throw new Error("No se encontró la dirección");
    }
    return { lat: Number(places[0].lat), lng: Number(places[0].lon) };
  },

  // Coordenadas -> dirección (al arrastrar el marcador o tocar el mapa)
  async reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
    const place = await nominatim<NominatimPlace>("/reverse", {
      lat: String(lat),
      lon: String(lng),
      addressdetails: "1",
    });

    if (!place || (!place.address && !place.display_name)) {
      throw new Error("No se encontró la dirección");
    }
    return toReadable(place);
  },

  // Ruta del repartidor (OSRM público, gratis)
  async getRoute(
    origin: GeocodeResult,
    destination: GeocodeResult,
  ): Promise<[number, number][]> {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const res = await fetch(`${url}?overview=full&geometries=geojson`);

    if (!res.ok) {
      throw new Error("OSRM request failed");
    }

    const data: OsrmResponse = await res.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    // OSRM devuelve [lng, lat]; el mapa usa [lat, lng]
    return data.routes[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng] as [number, number],
    );
  },
};
