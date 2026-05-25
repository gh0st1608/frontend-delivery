import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, {
  AnimatedRegion,
  Marker,
  Polyline,
} from "react-native-maps";
import { DeliveryPhase } from "@/api/socket/types/order";
import {
  isPickupPhase,
  resolveTrackingDestination,
} from "@/utils/tracking-phase";

type LatLngTuple = [number, number];

type Props = {
  phase: DeliveryPhase;
  courier: { lat: number; lng: number };
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  route: LatLngTuple[];
};

export function MapRoute({
  phase,
  courier,
  pickup,
  dropoff,
  route,
}: Props) {
  const courierPosition = useRef(
    new AnimatedRegion({
      latitude: courier.lat,
      longitude: courier.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
  ).current;

  const destination = useMemo(() => {
    return resolveTrackingDestination(phase, pickup, dropoff);
  }, [phase, pickup, dropoff]);

  useEffect(() => {
    courierPosition
      .timing({
        latitude: courier.lat,
        longitude: courier.lng,
        duration: 800,
        useNativeDriver: false,
      } as any)
      .start();
  }, [courier.lat, courier.lng, courierPosition]);

  return (
    <MapView
      style={styles.container}
      initialRegion={{
        latitude: courier.lat,
        longitude: courier.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker.Animated coordinate={courierPosition as any} />

      <Marker
        coordinate={{
          latitude: pickup.lat,
          longitude: pickup.lng,
        }}
      />

      <Marker
        coordinate={{
          latitude: dropoff.lat,
          longitude: dropoff.lng,
        }}
      />

      {route.length > 0 && destination && (
        <Polyline
          coordinates={route.map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }))}
          strokeWidth={4}
          strokeColor={isPickupPhase(phase) ? "#3B82F6" : "#22C55E"}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
