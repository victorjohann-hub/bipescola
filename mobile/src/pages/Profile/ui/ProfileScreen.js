import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { Input } from "@shared/ui/Input/Input";
import { Button } from "@shared/ui/Button/Button";
import { changePasswordAPI, updateUserPhotoAPI } from "@shared/api/userApi";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
];

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    nome: "Carregando...",
    email: "...",
    role: "...",
    foto: null,
  });

  // Modal Alterar Senha
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmNovaSenha, setConfirmNovaSenha] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Modal Alterar Foto
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('@bipescola_user');
        if (userStr) {
          const parsed = JSON.parse(userStr);
          setUserData(parsed);
          if (parsed.foto) {
            setPhotoUrl(parsed.foto);
          }
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

  const handleChangePassword = async () => {
    if (!senhaAtual.trim() || !novaSenha.trim()) {
      Alert.alert('Atenção', 'Preencha a senha atual e a nova senha.');
      return;
    }

    if (novaSenha.length < 8) {
      Alert.alert('Atenção', 'A nova senha deve possuir no mínimo 8 caracteres.');
      return;
    }

    if (novaSenha !== confirmNovaSenha) {
      Alert.alert('Erro', 'A confirmação de senha não confere.');
      return;
    }

    try {
      setSavingPassword(true);
      await changePasswordAPI({ senhaAtual, novaSenha });
      Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!');
      setPasswordModalVisible(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmNovaSenha('');
    } catch (error) {
      Alert.alert('Erro ao Alterar Senha', error.message || 'Senha atual incorreta.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUpdatePhoto = async (selectedUrl) => {
    const targetUrl = selectedUrl || photoUrl;
    if (!targetUrl.trim()) {
      Alert.alert('Atenção', 'Informe ou selecione a URL da foto.');
      return;
    }

    try {
      setSavingPhoto(true);
      await updateUserPhotoAPI(userData.id, targetUrl.trim());
      
      const updatedUser = { ...userData, foto: targetUrl.trim() };
      setUserData(updatedUser);
      await AsyncStorage.setItem('@bipescola_user', JSON.stringify(updatedUser));
      
      Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
      setPhotoModalVisible(false);
    } catch (error) {
      Alert.alert('Erro ao Atualizar Foto', error.message || 'Falha na conexão com o servidor.');
    } finally {
      setSavingPhoto(false);
    }
  };



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
  const avatarUri = userData.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nome || 'Usuario')}&background=0B3B60&color=fff&size=150`;

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <Text style={styles.headerSubtitle}>Dados cadastrais e credenciais de acesso</Text>
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
          <TouchableOpacity 
            style={styles.avatarContainer} 
            activeOpacity={0.8}
            onPress={() => setPhotoModalVisible(true)}
          >
            <Image 
              source={{ uri: avatarUri }} 
              style={styles.profileImage} 
            />
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={14} color={colors.textInverse} />
            </View>
          </TouchableOpacity>

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
            onPress={() => setPasswordModalVisible(true)}
          >
            <Feather name="lock" size={18} color={colors.primary} style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Alterar Senha</Text>
              <Text style={styles.actionSubtitle}>Atualize suas credenciais de segurança</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Alteração de Senha */}
      <Modal visible={passwordModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Senha</Text>
              <TouchableOpacity 
                onPress={() => setPasswordModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Senha Atual"
              placeholder="Digite a senha atual"
              isPassword
              value={senhaAtual}
              onChangeText={setSenhaAtual}
            />

            <Input
              label="Nova Senha (Mínimo 8 caracteres)"
              placeholder="••••••••"
              isPassword
              value={novaSenha}
              onChangeText={setNovaSenha}
            />

            <Input
              label="Confirmar Nova Senha"
              placeholder="••••••••"
              isPassword
              value={confirmNovaSenha}
              onChangeText={setConfirmNovaSenha}
            />

            <View style={styles.modalButtonContainer}>
              <Button
                title="Salvar Nova Senha"
                loading={savingPassword}
                onPress={handleChangePassword}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de Alteração de Foto */}
      <Modal visible={photoModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Foto de Perfil</Text>
              <TouchableOpacity 
                onPress={() => setPhotoModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Insira a URL de uma foto ou escolha um dos avatares rápidos:
            </Text>

            <View style={styles.presetsRow}>
              {PRESET_AVATARS.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.presetItem,
                    photoUrl === url && styles.presetItemSelected,
                  ]}
                  onPress={() => setPhotoUrl(url)}
                >
                  <Image source={{ uri: url }} style={styles.presetImage} />
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="URL da Foto"
              placeholder="https://exemplo.com/foto.jpg"
              value={photoUrl}
              onChangeText={setPhotoUrl}
              autoCapitalize="none"
            />

            <View style={styles.modalButtonContainer}>
              <Button
                title="Salvar Foto de Perfil"
                loading={savingPhoto}
                onPress={() => handleUpdatePhoto()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    width: 32,
    height: 32,
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
  // Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  presetItem: {
    width: 54,
    height: 54,
    borderRadius: radius.full,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetItemSelected: {
    borderColor: colors.primary,
  },
  presetImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.full,
  },
  modalButtonContainer: {
    marginTop: spacing.sm,
  },
});
