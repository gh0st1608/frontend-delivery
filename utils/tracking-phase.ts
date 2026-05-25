export type TrackingPhase =
  | "ASSIGNED"
  | "PREPARING"
  | "TO_PICKUP"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "TO_DROPOFF"
  | "DELIVERED";

export function isPickupPhase(phase: string) {
  return (
    phase === "ASSIGNED" ||
    phase === "PREPARING" ||
    phase === "TO_PICKUP"
  );
}

export function isDropoffPhase(phase: string) {
  return (
    phase === "PICKED_UP" ||
    phase === "ON_THE_WAY" ||
    phase === "TO_DROPOFF"
  );
}

export function isDeliveredPhase(phase: string) {
  return phase === "DELIVERED";
}

export function resolveTrackingDestination<T>(
  phase: string,
  pickup: T,
  dropoff: T,
) {
  if (isPickupPhase(phase)) return pickup;
  if (isDropoffPhase(phase)) return dropoff;
  return null;
}
