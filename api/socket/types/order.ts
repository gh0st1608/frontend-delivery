import { TrackingPhase } from "@/utils/tracking-phase";

export type DeliveryPhase = TrackingPhase;

export interface CourierAssignedSocketEvent {
  orderId: string;
  courierId: string;
}

export interface OrderTrackingSocketEvent {
  orderId: string;
  phase: DeliveryPhase ;
  courier: {
    id: string;
    name: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  pickup: {
    lat: number;
    lng: number;
  };
  dropoff: {
    lat: number;
    lng: number;
    city: string;
    address: string;
  };
  eta: {
    distanceKm: number;
    etaMinutes: number;
  };
}
