import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

export const AdminMenuScreen = ({ navigation }) => {
  return (
    <ResponsiveContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Feather name="shield" size={14} color={colors.highlight} />
          <Text style={styles.badgeText}>Área de Gestão</Text>
        </View>
        <Text style={styles.headerTitle}>Painel do Administrador</Text>
        <Text style={styles.headerSubtitle}>Gerencie os acessos, cadastros e alunos da instituição</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card: Cadastrar */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.75}
          onPress={() => navigation.navigate('Register')}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.highlightSurface }]}>
            <Feather name="user-plus" size={24} color={colors.highlight} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Novo Cadastro</Text>
            <Text style={styles.cardDesc}>Adicione novos Professores, Pais, Alunos e Coordenadores</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Card: Gerenciar Usuários */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.75}
          onPress={() => navigation.navigate('UserManagement')}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.primarySurface }]}>
            <Feather name="users" size={24} color={colors.primary} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Gerenciar Usuários</Text>
            <Text style={styles.cardDesc}>Visualize, edite e remova acessos ao sistema escolar</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Card: Gerenciar Alunos */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.75}
          onPress={() => navigation.navigate('StudentManagement')}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.secondarySurface }]}>
            <Feather name="book-open" size={24} color={colors.secondary} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Gerenciar Alunos</Text>
            <Text style={styles.cardDesc}>Consulte matrículas, turmas e status dos estudantes</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlightSurface,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    color: colors.highlight,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.card,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
