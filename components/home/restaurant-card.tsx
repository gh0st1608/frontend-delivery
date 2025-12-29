import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export const RestaurantCard = ({
  restaurant,
  onPress,
}: {
  restaurant: any;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.meta}>
          ⭐ {restaurant.rating} • {restaurant.deliveryTime} min
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  image: {
    height: 170,
    borderRadius: 16,
  },
  info: {
    marginTop: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    marginTop: 4,
    color: "#777",
    fontSize: 13,
  },
});
