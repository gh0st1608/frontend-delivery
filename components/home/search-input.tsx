import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onFilterPress?: () => void;
}

export default function SearchWithFilter({
  placeholder,
  value,
  onChangeText,
  onFocus,
  onFilterPress,
}: Props) {
  return (
    <View style={styles.row}>
      {/* SEARCH INPUT */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
        />
      </View>

      {/* FILTER BUTTON */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={onFilterPress}
        activeOpacity={0.8}
      >
        <Ionicons name="options-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginRight: 12, // separación real del botón
  },

  icon: {
    marginRight: 10,
    opacity: 0.6,
  },

  input: {
    flex: 1,
    fontSize: 15,
  },

  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Android
    elevation: 5,
  },
});
