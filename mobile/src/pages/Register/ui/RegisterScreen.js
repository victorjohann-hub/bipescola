import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Feather } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";
import { ParentRegister } from "./ParentRegister";
import { EmployeeRegister } from "./EmployeeRegister";

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const { isTablet } = useResponsiveLayout();
  const [registerType, setRegisterType] = useState("parent"); // 'parent' | 'employee'

  return (
    <ResponsiveContainer style={styles.safeArea}>
      {/* Header com botão voltar e Segmented Control */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Central de Cadastros</Text>
            <Text style={styles.headerSubtitle}>
              Credenciamento de novos responsáveis, alunos e colaboradores
            </Text>
          </View>
        </View>

        {/* Segmented Control (Abas Rápidas) */}
        <View
          style={[
            styles.segmentedBar,
            isTablet && styles.segmentedBarTablet,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.segmentTab,
              registerType === "parent" && styles.segmentTabActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setRegisterType("parent")}
          >
            <Feather
              name="users"
              size={16}
              color={
                registerType === "parent"
                  ? colors.textInverse
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentTabText,
                registerType === "parent" && styles.segmentTabTextActive,
              ]}
            >
              Responsável & Aluno
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentTab,
              registerType === "employee" && styles.segmentTabActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setRegisterType("employee")}
          >
            <Feather
              name="briefcase"
              size={16}
              color={
                registerType === "employee"
                  ? colors.textInverse
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentTabText,
                registerType === "employee" && styles.segmentTabTextActive,
              ]}
            >
              Funcionário / Equipe
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {registerType === "parent" ? <ParentRegister /> : <EmployeeRegister />}
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  backBtn: {
    padding: spacing.xs,
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
  segmentedBar: {
    flexDirection: "row",
    backgroundColor: colors.background,
    padding: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  segmentedBarTablet: {
    maxWidth: 520,
  },
  segmentTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  segmentTabActive: {
    backgroundColor: colors.highlight,
    ...shadows.subtle,
  },
  segmentTabText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    color: colors.textSecondary,
  },
  segmentTabTextActive: {
    color: colors.textInverse,
    fontWeight: "700",
  },
});
