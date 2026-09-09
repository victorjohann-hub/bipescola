import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export const Input = ({
  label,
  isPassword,
  backgroundColor,
  borderColor,
  labelColor,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const wrapperStyle = [
    styles.inputWrapper,
    backgroundColor ? { backgroundColor } : null,
    borderColor ? { borderColor } : null,
  ];

  const labelStyle = [styles.label, labelColor ? { color: labelColor } : null];

  const iconColor = labelColor || "#02386A";

  return (
    <View style={styles.container}>
      <View style={wrapperStyle}>
        <View style={styles.textContainer}>
          <Text style={labelStyle}>{label}</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={isPassword && !isPasswordVisible}
            placeholderTextColor={iconColor}
            {...props}
          />
        </View>
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  inputWrapper: {
    backgroundColor: "rgba(90, 155, 214, 0.5)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5A9BD6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: "#5A9BD6",
    fontSize: 10,
    fontFamily: "Roboto_300Light",
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: "#000",
    padding: 0,
  },
  iconContainer: {
    paddingLeft: 8,
  },
});
