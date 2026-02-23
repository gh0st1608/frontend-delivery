export type DeliveryPhase =
  | "TO_PICKUP"
  | "TO_DROPOFF"
  | "DELIVERED";

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
  };
  eta: {
    distanceKm: number;
    etaMinutes: number;
  };
}
