import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing } from "@shared/theme";

export const Input = ({
  label,
  isPassword,
  backgroundColor,
  borderColor,
  labelColor,
  error,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const currentBorderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : borderColor || colors.border;

  const currentBg = backgroundColor || colors.surface;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, labelColor ? { color: labelColor } : null]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: currentBg,
            borderColor: currentBorderColor,
          },
          isFocused && styles.inputWrapperFocused,
        ]}
      >
        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: spacing.md, // 16px
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    fontWeight: "500",
    marginBottom: spacing.xs + 2, // 6px
  },
  inputWrapper: {
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    paddingLeft: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 28,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    marginTop: spacing.xs,
  },
});
