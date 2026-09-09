import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const Button = ({
  title,
  onPress,
  style,
  backgroundColor,
  textColor,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        backgroundColor ? { backgroundColor } : null,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, textColor ? { color: textColor } : null]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5A9BD6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    width: 203,
    height: 48,
  },
  text: {
    color: "#02386A",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
  },
});
