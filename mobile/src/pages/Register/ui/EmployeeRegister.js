import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button } from "@shared/ui/Button/Button";
import { RegisterInput } from "./RegisterInput";
import { Feather } from "@expo/vector-icons";
import { createUserAPI } from "@shared/api/userApi";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

const ROLES = [
  { id: "PROF", label: "Professor(a)", icon: "book-open" },
  { id: "PORTEIRO", label: "Portaria & Segurança", icon: "key" },
  { id: "ADM", label: "Coordenador / ADM", icon: "shield" },
];

export const EmployeeRegister = () => {
  const { isTablet } = useResponsiveLayout();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [role, setRole] = useState("PROF");

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Atenção", "Preencha ao menos Nome e Email.");
      return;
    }
    try {
      setLoading(true);
      const res = await createUserAPI({
        nome: nome.trim(),
        email: email.trim(),
        role,
      });
      const tempPass = res?.tempPassword || "Definida no sistema";
      Alert.alert(
        "Sucesso",
        `Cadastro de funcionário (${role}) realizado com sucesso!\n\nE-mail: ${email}\nSenha Temporária: ${tempPass}`,
        [
          {
            text: "OK",
            onPress: () => {
              setNome("");
              setTelefone("");
              setEmail("");
              setCpf("");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao cadastrar funcionário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.formCard, isTablet && styles.formCardTablet]}>
        <View style={styles.sectionHeader}>
          <Feather name="briefcase" size={18} color={colors.highlight} />
          <Text style={styles.sectionTitle}>
            Informações do Colaborador Escolar
          </Text>
        </View>

        <View style={[styles.fieldsGrid, isTablet && styles.fieldsGridTablet]}>
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="Nome Completo"
            placeholder="Ex: Carlos Silva"
            required
            value={nome}
            onChangeText={setNome}
          />
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="Telefone (Opcional)"
            placeholder="Ex: (79) 91234-5678"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="E-mail Institucional"
            placeholder="Ex: carlos@bipescola.com"
            keyboardType="email-address"
            autoCapitalize="none"
            required
            value={email}
            onChangeText={setEmail}
          />
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="CPF (Opcional)"
            placeholder="Ex: 123.456.789-00"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
          />
        </View>

        <Text style={styles.roleSectionLabel}>Cargo / Perfil de Acesso</Text>

        <View style={styles.rolesRow}>
          {ROLES.map((r) => {
            const isSelected = role === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleChip, isSelected && styles.roleChipActive]}
                activeOpacity={0.75}
                onPress={() => setRole(r.id)}
              >
                <Feather
                  name={r.icon}
                  size={16}
                  color={isSelected ? colors.textInverse : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleChipText,
                    isSelected && styles.roleChipTextActive,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={[
            styles.buttonContainer,
            isTablet && styles.buttonContainerTablet,
          ]}
        >
          {loading ? (
            <ActivityIndicator size="large" color={colors.highlight} />
          ) : (
            <Button
              title="Cadastrar Funcionário"
              backgroundColor={colors.highlight}
              onPress={handleRegister}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  formCardTablet: {
    padding: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  fieldsGrid: {
    width: "100%",
  },
  fieldsGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  halfField: {
    width: "48.5%",
  },
  roleSectionLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  rolesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  roleChipActive: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight,
  },
  roleChipText: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    color: colors.textSecondary,
  },
  roleChipTextActive: {
    color: colors.textInverse,
    fontWeight: "700",
  },
  buttonContainer: {
    width: "100%",
    marginTop: spacing.sm,
  },
  buttonContainerTablet: {
    maxWidth: 300,
    alignSelf: "flex-end",
  },
});
