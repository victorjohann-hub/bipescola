import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

export const EvaluationCard = ({ evaluation }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Image 
          source={{ uri: evaluation.avatarUrl || 'https://ui-avatars.com/api/?name=Professor&background=C25E00&color=fff' }} 
          style={styles.avatar} 
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{evaluation.authorName}</Text>
          <Text style={styles.role}>{evaluation.authorRole}</Text>
        </View>

        {/* Badge de Nota */}
        <View style={styles.gradeBadge}>
          <Feather name="star" size={14} color={colors.accent} />
          <Text style={styles.gradeBadgeText}>{evaluation.grade}/5</Text>
        </View>
      </View>
      
      <View style={styles.bodyContainer}>
        <View style={styles.aspectRow}>
          <Text style={styles.aspectLabel}>Critério Avaliado:</Text>
          <Text style={styles.aspectValue}>{evaluation.aspect}</Text>
        </View>

        <Text style={styles.commentLabel}>Parecer do Professor:</Text>
        <Text style={styles.content}>{evaluation.comment}</Text>
      </View>

      <View style={styles.footer}>
        <Feather name="clock" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
        <Text style={styles.date}>{evaluation.date}</Text>
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
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    marginRight: spacing.md,
    backgroundColor: colors.accentSurface,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
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
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: 4,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: colors.accent,
  },
  bodyContainer: {
    marginBottom: spacing.sm,
  },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  aspectLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginRight: 6,
  },
  aspectValue: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  commentLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  content: {
    ...typography.body,
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
