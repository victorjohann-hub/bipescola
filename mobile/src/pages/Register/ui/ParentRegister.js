import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "@shared/ui/Button/Button";
import { RegisterInput } from "./RegisterInput";
import { createParentAPI } from "@shared/api/userApi";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

export const ParentRegister = () => {
  const { isTablet } = useResponsiveLayout();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert(
        "Atenção",
        "Preencha o Nome e o E-mail do responsável."
      );
      return;
    }
    try {
      setLoading(true);
      const res = await createParentAPI({ nome: nome.trim(), email: email.trim() });
      const tempPass = res?.tempPassword || "Definida no sistema";
      Alert.alert(
        "Sucesso",
        `Cadastro de responsável realizado com sucesso!\n\nE-mail: ${email.trim()}\nSenha Temporária: ${tempPass}`,
        [
          {
            text: "OK",
            onPress: () => {
              setNome("");
              setEmail("");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao cadastrar responsável.");
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
          <Feather name="user" size={18} color={colors.highlight} />
          <Text style={styles.sectionTitle}>Dados do Responsável Legal</Text>
        </View>

        <View style={[styles.fieldsGrid, isTablet && styles.fieldsGridTablet]}>
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="Nome Completo do Responsável"
            placeholder="Ex: Maria Oliveira"
            required
            value={nome}
            onChangeText={setNome}
          />
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="E-mail de Acesso"
            placeholder="Ex: maria@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            required
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.guidanceBox}>
          <Feather name="info" size={18} color={colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guidanceTitle}>Vínculo de Alunos Dependentes</Text>
            <Text style={styles.guidanceText}>
              A credencial de acesso do responsável será gerada com senha temporária. Para vincular os filhos a esta conta, acesse o módulo "Gerenciar Alunos" após concluir este cadastro.
            </Text>
          </View>
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
              title="Concluir Cadastro de Responsável"
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
  guidanceBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.secondarySurface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  guidanceTitle: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    color: colors.secondary,
    marginBottom: 2,
  },
  guidanceText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    width: "100%",
    marginTop: spacing.sm,
  },
  buttonContainerTablet: {
    maxWidth: 320,
    alignSelf: "flex-end",
  },
});
