export interface GeocodeResult {
  lat: number;
  lng: number;
}

// Sugerencia de dirección para el autocompletado (Nominatim / OSM)
export interface AddressSuggestion {
  lat: number;
  lng: number;
  label: string; // texto mostrado en la lista
  city: string;
  street: string;
}

// Respuesta de Nominatim (search / reverse) con addressdetails=1
export interface NominatimAddress {
  road?: string;
  house_number?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
}

export interface NominatimPlace {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleGeocodeResult {
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GoogleGeocodeResponse {
  results: GoogleGeocodeResult[];
  status: string;
  error_message?: string;
}

export interface ReverseGeocodeResult {
  city: string;
  street: string;
  fullAddress: string;
}

export interface GoogleDirectionsRoute {
  overview_polyline: {
    points: string;
  };
}

export interface GoogleDirectionsResponse {
  routes: GoogleDirectionsRoute[];
  status: string;
  error_message?: string;
}

export interface OsrmRoute {
  geometry: {
    coordinates: [number, number][];
  };
}

export interface OsrmResponse {
  routes: OsrmRoute[];
}