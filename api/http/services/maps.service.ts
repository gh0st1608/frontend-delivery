import mapsApi from "@/api/http/clients/maps.client";
import {
  GoogleGeocodeResponse,
  GeocodeResult,
  ReverseGeocodeResult,
  GoogleDirectionsResponse,
  OsrmResponse,
} from "@/api/http/types/maps";
import { CONFIG } from "@/constants/config";

const GOOGLE_KEY = CONFIG.API_KEY_GOOGLE;

export const MapsService = {
  async geocodeAddress(address: string): Promise<GeocodeResult> {
    const encoded = encodeURIComponent(address);

    const res = await mapsApi.get<GoogleGeocodeResponse>(`/geocode/json`, {
      params: {
        address: encoded,
        key: GOOGLE_KEY,
      },
    });

    if (res.data.status !== "OK") {
      throw new Error(res.data.error_message || "Geocoding failed");
    }

    const location = res.data.results[0].geometry.location;

    return {
      lat: location.lat,
      lng: location.lng,
    };
  },

  async reverseGeocode(
    lat: number,
    lng: number,
  ): Promise<ReverseGeocodeResult> {
    const res = await mapsApi.get<GoogleGeocodeResponse>(`/geocode/json`, {
      params: {
        latlng: `${lat},${lng}`,
        key: GOOGLE_KEY,
      },
    });

    if (res.data.status !== "OK") {
      throw new Error(res.data.error_message || "Reverse geocoding failed");
    }

    const result = res.data.results[0];

    const addressComponents = result.address_components;

    const city =
      addressComponents.find((c) => c.types.includes("locality"))?.long_name ??
      "";

    const street =
      addressComponents.find((c) => c.types.includes("route"))?.long_name ??
      result.formatted_address;

    return {
      city,
      street,
      fullAddress: result.formatted_address,
    };
  },
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

    // Convertir [lng, lat] → [lat, lng]
    const formattedRoute = data.routes[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng] as [number, number],
    );
    console.log('formattedRoute',formattedRoute)
    return formattedRoute;
  },
  /* async getRoute(origin: GeocodeResult, destination: GeocodeResult): Promise<string> {
    const res = await mapsApi.get<GoogleDirectionsResponse>(
      "/directions/json",
      {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          key: GOOGLE_KEY,
        },
      },
    );

    if (res.data.status !== "OK") {
      throw new Error(res.data.error_message || "Directions failed");
    }

    return res.data.routes[0].overview_polyline.points;
  }, */
};
