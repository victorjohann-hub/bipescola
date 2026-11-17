import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@shared/theme";

export const RegisterInput = ({
  label,
  placeholder,
  isPassword,
  required = false,
  containerStyle,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <View style={styles.requiredDot} />}
        </View>
      ) : null}
      <View
        style={[
          styles.inputBox,
          focused && {
            borderColor: colors.highlight,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
    gap: 6,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  requiredDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.highlight,
  },
  inputBox: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
});
