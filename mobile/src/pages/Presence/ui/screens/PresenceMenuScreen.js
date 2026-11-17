import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Feather } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

export const PresenceMenuScreen = ({ navigation }) => {
  const { isTablet } = useResponsiveLayout();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const userStr = await AsyncStorage.getItem("@bipescola_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setRole(user.role);
        }
      } catch (e) {
        console.error("Erro ao carregar role", e);
      } finally {
        setLoading(false);
      }
    };
    loadRole();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  const isParent = role === "PARENT";
  const isPorteiro = role === "PORTEIRO";
  const isStaff = ["ADM", "PROF", "PORTEIRO"].includes(role);

  const menuActions = [
    ...(isParent
      ? [
          {
            id: "qr-parent",
            title: "Gerar Código QR do Aluno",
            desc: "Mostre este código para o porteiro ou professor registrar a entrada do seu filho",
            icon: "maximize",
            color: colors.secondary,
            bg: colors.secondarySurface,
            route: "QRCodeGenerator",
            badge: "Carteirinha Digital",
          },
        ]
      : []),
    ...(isStaff
      ? [
          {
            id: "qr-scan",
            title: "Escanear Código QR",
            desc: "Aproxime a câmera do QR Code apresentado pelo responsável ou estudante na portaria",
            icon: "camera",
            color: colors.secondary,
            bg: colors.secondarySurface,
            route: "QRCodeScanner",
            badge: "Leitura Óptica / Totem",
          },
          {
            id: "manual-call",
            title: "Chamada Manual por Turma",
            desc: "Consulte a lista de estudantes da turma e lance presenças ou faltas com 1 toque",
            icon: "check-square",
            color: colors.primary,
            bg: colors.primarySurface,
            route: "ClassList",
            badge: "Diário de Classe",
          },
          {
            id: "history",
            title: "Histórico & Frequência",
            desc: "Consulte a assiduidade diária, semanal e métricas de comparecimento escolar",
            icon: "calendar",
            color: colors.accent,
            bg: colors.accentSurface,
            route: "AttendanceHistory",
            badge: "Relatórios & KPIs",
          },
        ]
      : []),
    ...(!isParent && !isPorteiro
      ? [
          {
            id: "qr-staff",
            title: "Visualizar QR Code de Aluno",
            desc: "Consulte e gere o crachá de identificação QR de qualquer estudante matriculado",
            icon: "user-check",
            color: colors.highlight,
            bg: colors.highlightSurface,
            route: "QRCodeGenerator",
            badge: "Crachás de Alunos",
          },
        ]
      : []),
  ];

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <View style={styles.headerBadge}>
            <Feather name="check-circle" size={14} color={colors.secondary} />
            <Text style={styles.headerBadgeText}>Módulo de Frequência</Text>
          </View>
          <Text style={styles.headerTitle}>Controle de Presença</Text>
          <Text style={styles.headerSubtitle}>
            {isParent
              ? "Apresente o código QR do estudante na portaria da instituição"
              : "Validação óptica, chamada em sala de aula e acompanhamento diário"}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {menuActions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.actionCard,
              isTablet && styles.actionCardTablet,
            ]}
            activeOpacity={0.75}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Feather name={item.icon} size={28} color={item.color} />
              </View>
              {isTablet && (
                <View style={[styles.modulePill, { backgroundColor: item.bg }]}>
                  <Text style={[styles.modulePillText, { color: item.color }]}>
                    {item.badge}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>

            {isTablet ? (
              <View style={styles.tabletCardFooter}>
                <Text style={[styles.tabletCardAction, { color: item.color }]}>
                  Abrir ferramenta
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondarySurface,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: 6,
    marginBottom: spacing.xs,
  },
  headerBadgeText: {
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
    color: colors.secondary,
    fontWeight: "600",
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.md,
  },
  scrollContentTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  actionCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.card,
  },
  actionCardTablet: {
    width: "48.2%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 208,
    padding: spacing.xl,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 56,
    height: 56,
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
    fontFamily: "Roboto_500Medium",
    fontWeight: "700",
  },
  cardContent: {
    flex: 1,
    marginRight: spacing.sm,
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
