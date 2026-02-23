export interface GeocodeResult {
  lat: number;
  lng: number;
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