import React, { useEffect, useRef, useMemo } from "react";
import { StyleSheet } from "react-native";
import MapView, {
  Marker,
  Polyline,
  AnimatedRegion,
} from "react-native-maps";

type LatLngTuple = [number, number];

type DeliveryPhase = "TO_PICKUP" | "TO_DROPOFF" | "DELIVERED";

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
    })
  ).current;

  const animateCourier = (lat: number, lng: number) => {
  courierPosition.timing({
    latitude: lat,
    longitude: lng,
    duration: 800,
    useNativeDriver: false,
  } as any).start();
};

  useEffect(() => {
    animateCourier(courier.lat, courier.lng);
  }, [courier.lat, courier.lng]);

  // 🎯 destino según fase
  const destination = useMemo(() => {
    if (phase === "TO_PICKUP") return pickup;
    if (phase === "TO_DROPOFF") return dropoff;
    return null;
  }, [phase, pickup, dropoff]);

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
      {/* 🚗 courier */}
      <Marker.Animated coordinate={courierPosition as any} />

      {/* 📦 pickup */}
      <Marker
        coordinate={{
          latitude: pickup.lat,
          longitude: pickup.lng,
        }}
      />

      {/* 🏠 dropoff */}
      <Marker
        coordinate={{
          latitude: dropoff.lat,
          longitude: dropoff.lng,
        }}
      />

      {/* 🛣 ruta */}
      {route.length > 0 && destination && (
        <Polyline
          coordinates={route.map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }))}
          strokeWidth={4}
          strokeColor={phase === "TO_PICKUP" ? "#3B82F6" : "#22C55E"}
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