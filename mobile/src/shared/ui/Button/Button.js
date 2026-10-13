import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, radius, spacing, shadows } from "@shared/theme";

export const Button = ({
  title,
  onPress,
  style,
  backgroundColor,
  textColor,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger'
}) => {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSecondary = variant === 'secondary';

  let defaultBg = colors.primary;
  let defaultText = colors.textInverse;

  if (isSecondary) {
    defaultBg = colors.secondary;
    defaultText = colors.textInverse;
  } else if (isOutline) {
    defaultBg = 'transparent';
    defaultText = colors.primary;
  } else if (isDanger) {
    defaultBg = colors.error;
    defaultText = colors.textInverse;
  }

  const bg = backgroundColor || defaultBg;
  const fg = textColor || defaultText;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.button,
        { backgroundColor: bg },
        isOutline && { borderWidth: 1.5, borderColor: colors.primary },
        !isOutline && shadows.subtle,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <Text style={[styles.text, { color: fg }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 4, // 12px
    paddingHorizontal: spacing.lg,   // 24px
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
  },
  text: {
    fontSize: 15,
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.6,
  },
});
