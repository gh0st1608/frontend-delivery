import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";

interface Props {
  lat?: number;
  lng?: number;
  onSelect: (lat: number, lng: number) => void;
}

export function MapPicker({
  lat,
  lng,
  onSelect,
}: Props) {
  const region = {
    latitude: lat ?? -12.0464,
    longitude: lng ?? -77.0428,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handlePress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onSelect(latitude, longitude);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={handlePress}
        showsUserLocation
      >
        {lat && lng && (
          <Marker
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
  },

  map: {
    flex: 1,
  },
});
