import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";

export const NoticeCard = ({ notice, style }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <View>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                notice.avatarUrl ||
                "https://ui-avatars.com/api/?name=Escola&background=C2185B&color=fff",
            }}
            style={styles.avatar}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {notice.authorName}
            </Text>
            <Text style={styles.role}>
              {notice.authorRole || "Comunicado Oficial"}
            </Text>
          </View>

          {notice.destinatario_nome ? (
            <View style={[styles.badge, styles.individualBadge]}>
              <Feather name="user-check" size={12} color={colors.accent} />
              <Text
                style={[styles.badgeText, { color: colors.accent }]}
                numberOfLines={1}
              >
                {notice.destinatario_nome}
              </Text>
            </View>
          ) : (
            <View style={styles.badge}>
              <Feather name="globe" size={12} color={colors.notice} />
              <Text style={styles.badgeText}>Geral</Text>
            </View>
          )}
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.subject}>{notice.subject}</Text>
          <Text style={styles.content}>{notice.content}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Feather
          name="calendar"
          size={12}
          color={colors.textMuted}
          style={{ marginRight: 4 }}
        />
        <Text style={styles.date}>{notice.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    justifyContent: "space-between",
    ...shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    marginRight: spacing.md,
    backgroundColor: colors.noticeSurface,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: spacing.xs,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  role: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.noticeSurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: 4,
    maxWidth: 140,
  },
  individualBadge: {
    backgroundColor: colors.accentSurface,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Roboto_700Bold",
    color: colors.notice,
    fontWeight: "700",
  },
  bodyContainer: {
    marginBottom: spacing.sm,
  },
  subject: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  content: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
