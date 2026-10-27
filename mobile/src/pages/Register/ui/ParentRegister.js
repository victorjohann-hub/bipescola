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
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    if (!nome || !email) {
      Alert.alert(
        "Atenção",
        "Preencha ao menos Nome e Email do responsável."
      );
      return;
    }
    try {
      setLoading(true);
      const res = await createParentAPI({ nome, email });
      const tempPass = res?.tempPassword || "Definida no sistema";
      Alert.alert(
        "Sucesso",
        `Cadastro de responsável realizado com sucesso!\n\nE-mail: ${email}\nSenha Temporária: ${tempPass}`,
        [
          {
            text: "OK",
            onPress: () => {
              setNome("");
              setTelefone("");
              setEmail("");
              setCpf("");
              setSenha("");
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
            label="Nome Completo"
            placeholder="Ex: Maria Oliveira"
            required
            value={nome}
            onChangeText={setNome}
          />
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="Telefone / WhatsApp"
            placeholder="Ex: (79) 91234-5678"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
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
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="CPF"
            placeholder="Ex: 123.456.789-00"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
          />
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="Senha Inicial (Opcional - Gerada automaticamente)"
            placeholder="••••••••"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <View style={[styles.sectionHeader, { marginTop: spacing.md }]}>
          <Feather name="book-open" size={18} color={colors.secondary} />
          <Text style={styles.sectionTitle}>
            Vínculo de Aluno(a) Dependente
          </Text>
        </View>

        <View style={[styles.fieldsGrid, isTablet && styles.fieldsGridTablet]}>
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="Nome do Aluno(a)"
            placeholder="Ex: Pedro Oliveira"
          />
          <RegisterInput
            containerStyle={isTablet && styles.halfField}
            label="CPF / Matrícula do Aluno(a)"
            placeholder="Ex: 123.456.789-00"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.addStudentButton} activeOpacity={0.75}>
          <Feather name="plus-circle" size={16} color={colors.secondary} />
          <Text style={styles.addStudentText}>
            Adicionar outro dependente
          </Text>
        </TouchableOpacity>

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
  addStudentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondarySurface,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  addStudentText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    color: colors.secondary,
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
