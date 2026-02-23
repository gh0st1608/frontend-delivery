import { useState } from "react";
import { MapsService } from "@/api/http/services/maps.service";

export function useGeocoding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = async (address: string) => {
    try {
      setLoading(true);
      setError(null);

      return await MapsService.geocodeAddress(address);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setError(null);

      return await MapsService.reverseGeocode(lat, lng);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    geocode,
    reverseGeocode,
    loading,
    error,
  };
}
