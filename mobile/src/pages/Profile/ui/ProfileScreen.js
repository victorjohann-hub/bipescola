import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    nome: "Carregando...",
    email: "...",
    role: "...",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('@bipescola_user');
        if (userStr) {
          setUserData(JSON.parse(userStr));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Deseja realmente encerrar a sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('@bipescola_token');
            await AsyncStorage.removeItem('@bipescola_user');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const messages = [
    {
      id: 1,
      senderName: "Profa. Sara Soares",
      senderRole: "Língua Portuguesa",
      avatar: "https://ui-avatars.com/api/?name=Sara+Soares&background=2E7D32&color=fff",
      aspect: "Expressão Verbal & Leitura",
      grade: "5/5",
      comment: "Excelente dedicação nas leituras em grupo durante as últimas semanas.",
      date: "12 de out. 2026",
    },
    {
      id: 2,
      senderName: "Profa. Larissa Sato",
      senderRole: "Artes",
      avatar: "https://ui-avatars.com/api/?name=Larissa+Sato&background=0B3B60&color=fff",
      aspect: "Criatividade & Participação",
      grade: "5/5",
      comment: "Trabalhos manuais executados com capricho e atenção aos detalhes.",
      date: "08 de out. 2026",
    },
  ];

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADM':
        return { label: 'Administrador Escolar', bg: colors.highlightSurface, text: colors.highlight };
      case 'PROF':
        return { label: 'Professor(a)', bg: colors.secondarySurface, text: colors.secondary };
      case 'PARENT':
        return { label: 'Responsável Legal', bg: colors.primarySurface, text: colors.primary };
      case 'PORTEIRO':
        return { label: 'Portaria & Segurança', bg: colors.warningSurface, text: colors.warning };
      default:
        return { label: role || 'Usuário', bg: colors.surface, text: colors.textSecondary };
    }
  };

  const roleInfo = getRoleLabel(userData.role);

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <Text style={styles.headerSubtitle}>Dados cadastrais e apontamentos</Text>
        </View>

        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="log-out" size={22} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nome || 'Usuario')}&background=0B3B60&color=fff&size=150` }} 
              style={styles.profileImage} 
            />
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={14} color={colors.textInverse} />
            </View>
          </View>

          <Text style={styles.profileName}>{userData.nome}</Text>
          
          <View style={[styles.roleBadge, { backgroundColor: roleInfo.bg }]}>
            <Text style={[styles.roleText, { color: roleInfo.text }]}>{roleInfo.label}</Text>
          </View>
        </View>

        {/* Informações da Conta */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>

          <View style={styles.infoRow}>
            <Feather name="mail" size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>E-mail de Acesso</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.actionBtn} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Feather name="lock" size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Alterar Senha</Text>
              <Text style={styles.actionSubtitle}>Atualize suas credenciais de segurança</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Seção de Comunicações Recentes */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {userData.role === "PARENT"
              ? "Observações do Aluno"
              : "Apontamentos Recentes"}
          </Text>

          <View style={styles.messagesList}>
            {messages.map((msg) => (
              <View key={msg.id} style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <Image
                    source={{ uri: msg.avatar }}
                    style={styles.messageAvatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.messageSenderName}>{msg.senderName}</Text>
                    <Text style={styles.messageSenderRole}>{msg.senderRole}</Text>
                  </View>
                  <View style={styles.gradeBadge}>
                    <Text style={styles.gradeText}>{msg.grade}</Text>
                  </View>
                </View>

                <View style={styles.messageBody}>
                  <Text style={styles.aspectTitle}>{msg.aspect}</Text>
                  <Text style={styles.messageText}>{msg.comment}</Text>
                </View>

                <Text style={styles.messageDate}>{msg.date}</Text>
              </View>
            ))}
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  logoutBtn: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.errorSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.md,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.card,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  roleBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  roleText: {
    fontSize: 12,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoIcon: {
    marginRight: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginTop: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    minHeight: 48,
  },
  actionTitle: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  messagesList: {
    gap: spacing.md,
  },
  messageCard: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  messageSenderName: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  messageSenderRole: {
    ...typography.caption,
    color: colors.textMuted,
  },
  gradeBadge: {
    backgroundColor: colors.secondarySurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  gradeText: {
    fontSize: 11,
    fontFamily: 'Roboto_700Bold',
    color: colors.secondary,
  },
  messageBody: {
    marginBottom: spacing.xs,
  },
  aspectTitle: {
    ...typography.captionBold,
    color: colors.primary,
    marginBottom: 2,
  },
  messageText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  messageDate: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});
