import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Feather } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

const ADMIN_CARDS = [
  {
    id: "register",
    title: "Novo Cadastro",
    desc: "Adicione novos Professores, Porteiros, Pais, Alunos e Coordenadores",
    icon: "user-plus",
    color: colors.highlight,
    bg: colors.highlightSurface,
    badge: "Credenciamento",
    route: "Register",
  },
  {
    id: "users",
    title: "Gerenciar Usuários",
    desc: "Visualize, edite permissões e remova acessos ao sistema escolar",
    icon: "users",
    color: colors.primary,
    bg: colors.primarySurface,
    badge: "Controle de Contas",
    route: "UserManagement",
  },
  {
    id: "students",
    title: "Gerenciar Alunos",
    desc: "Consulte matrículas, enturmação e status ativo/transferido dos estudantes",
    icon: "book-open",
    color: colors.secondary,
    bg: colors.secondarySurface,
    badge: "Secretaria Acadêmica",
    route: "StudentManagement",
  },
  {
    id: "classes",
    title: "Gerenciar Turmas",
    desc: "Crie, edite e organize as turmas e séries da instituição de ensino",
    icon: "layers",
    color: colors.accent,
    bg: colors.accentSurface,
    badge: "Estrutura Escolar",
    route: "ClassManagement",
  },
];

export const AdminMenuScreen = ({ navigation }) => {
  const { isTablet } = useResponsiveLayout();

  return (
    <ResponsiveContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Feather name="shield" size={14} color={colors.highlight} />
          <Text style={styles.badgeText}>Área de Gestão</Text>
        </View>
        <Text style={styles.headerTitle}>Painel do Administrador</Text>
        <Text style={styles.headerSubtitle}>
          Gerencie os acessos, cadastros, turmas e alunos da instituição
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet && styles.contentTabletGrid,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {ADMIN_CARDS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, isTablet && styles.cardTablet]}
            activeOpacity={0.75}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                <Feather name={item.icon} size={26} color={item.color} />
              </View>
              {isTablet && (
                <View style={[styles.modulePill, { backgroundColor: item.bg }]}>
                  <Text style={[styles.modulePillText, { color: item.color }]}>
                    {item.badge}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>

            {isTablet ? (
              <View style={styles.tabletCardFooter}>
                <Text style={[styles.tabletCardAction, { color: item.color }]}>
                  Acessar módulo
                </Text>
                <Feather name="arrow-right" size={18} color={item.color} />
              </View>
            ) : (
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        ))}
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.highlightSurface,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: "flex-start",
    marginBottom: spacing.xs,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
    color: colors.highlight,
    fontWeight: "600",
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  contentTabletGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.card,
  },
  cardTablet: {
    width: "48.2%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 204,
    padding: spacing.xl,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  modulePill: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  modulePillText: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  tabletCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    width: "100%",
    justifyContent: "space-between",
  },
  tabletCardAction: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
  },
});
