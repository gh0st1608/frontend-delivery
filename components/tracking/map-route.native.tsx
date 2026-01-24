import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import MapView, {
  Marker,
  Polyline,
  AnimatedRegion,
  Region
} from "react-native-maps";

type Props = {
  courier: { lat: number; lng: number };
  destination: { lat: number; lng: number };
};

export function MapRoute({ courier, destination }: Props) {
  // 🧠 AnimatedRegion correcto
  const courierPosition = useRef(
    new AnimatedRegion({
      latitude: courier.lat,
      longitude: courier.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  ).current;

  // 🚗 Animar movimiento del courier
  const animateCourier = (lat: number, lng: number) => {
    courierPosition.timing({
  latitude: lat,
  longitude: lng,
  duration: 1000,
  useNativeDriver: false,
} as Animated.TimingAnimationConfig & Region).start(); // 👈 cast necesario por bug de typings
  };

  useEffect(() => {
    animateCourier(courier.lat, courier.lng);
  }, [courier.lat, courier.lng]);

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
      {/* 🚗 Courier animado */}
      <Marker.Animated
        coordinate={courierPosition as any} // 👈 cast necesario
      />

      {/* 📍 Destino */}
      <Marker
        coordinate={{
          latitude: destination.lat,
          longitude: destination.lng,
        }}
      />

      {/* 🛣️ Ruta (mock) */}
      <Polyline
        coordinates={[
          { latitude: courier.lat, longitude: courier.lng },
          { latitude: destination.lat, longitude: destination.lng },
        ]}
        strokeWidth={4}
        strokeColor="#22C55E"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
});
