import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";

export const PresenceMenuScreen = ({ navigation }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const userStr = await AsyncStorage.getItem('@bipescola_user');
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  const isParent = role === 'PARENT';
  const isPorteiro = role === 'PORTEIRO';
  const isStaff = ['ADM', 'PROF', 'PORTEIRO'].includes(role);

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Controle de Presença</Text>
          <Text style={styles.headerSubtitle}>
            {isParent 
              ? "Apresente seu código QR na portaria"
              : "Validação e registro de entrada de alunos"}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card do Responsável: Apresentar QR Code */}
        {isParent && (
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("QRCodeGenerator")}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.secondarySurface }]}>
              <Feather name="maximize" size={28} color={colors.secondary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Gerar Código QR do Aluno</Text>
              <Text style={styles.cardDesc}>
                Mostre este código para o porteiro ou professor registrar a entrada do seu filho
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Ações da Equipe: Scanner de QR Code */}
        {isStaff && (
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("QRCodeScanner")}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.secondarySurface }]}>
              <Feather name="camera" size={28} color={colors.secondary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Escanear Código QR</Text>
              <Text style={styles.cardDesc}>
                Aproxime a câmera do QR Code apresentado pelo responsável ou estudante
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Ações da Equipe: Chamada Manual */}
        {isStaff && (
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("ClassList")}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.primarySurface }]}>
              <Feather name="check-square" size={28} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Chamada Manual</Text>
              <Text style={styles.cardDesc}>
                Consulte a lista de estudantes e registre presenças ou faltas no sistema
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Opção secundária para Admin/Prof ver gerador se necessário */}
        {!isParent && !isPorteiro && (
          <TouchableOpacity
            style={[styles.actionCard, { marginTop: spacing.md }]}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("QRCodeGenerator")}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.accentSurface }]}>
              <Feather name="user-check" size={28} color={colors.accent} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Visualizar QR Code de Aluno</Text>
              <Text style={styles.cardDesc}>
                Consulte e gere o código de identificação de estudantes
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
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
  actionCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.card,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
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
    lineHeight: 18,
  },
});
