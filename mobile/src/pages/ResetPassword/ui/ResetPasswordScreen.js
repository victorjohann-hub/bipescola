import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from '@expo/vector-icons';
import { Input } from '@shared/ui/Input/Input';
import { Button } from '@shared/ui/Button/Button';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';
import { forgotPasswordAPI, resetPasswordAPI } from '@shared/api/userApi';

export const ResetPasswordScreen = ({ navigation }) => {
  // 'request' (solicitar token) ou 'reset' (aplicar token + nova senha)
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe o seu e-mail cadastrado na instituição.');
      return;
    }

    try {
      setLoading(true);
      await forgotPasswordAPI({ email: email.trim() });
      Alert.alert(
        'Solicitação Enviada',
        'Se o e-mail estiver cadastrado, o token de recuperação foi gerado. Insira o código recebido abaixo.',
        [{ text: 'Avançar', onPress: () => setStep('reset') }]
      );
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao solicitar código.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim() || !token.trim() || !newPassword.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail, o código de recuperação e a nova senha.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Atenção', 'A nova senha deve possuir pelo menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas digitadas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordAPI({
        email: email.trim(),
        token: token.trim(),
        novaSenha: newPassword
      });

      Alert.alert(
        'Sucesso!',
        'Sua senha foi redefinida com sucesso. Faça login com as novas credenciais.',
        [{ text: 'Fazer Login', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Erro na Redefinição', error.message || 'Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recuperação de Acesso</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../../assets/logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>

          <View style={styles.formCard}>
            {step === 'request' ? (
              <>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.title}>Esqueceu sua senha?</Text>
                  <Text style={styles.subtitle}>
                    Digite seu e-mail institucional. Enviaremos o código de redefinição para validação.
                  </Text>
                </View>

                <View style={styles.inputsContainer}>
                  <Input 
                    label="E-mail Institucional" 
                    placeholder="seu.email@bipescola.com" 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Button 
                    title="Enviar Código de Recuperação" 
                    loading={loading}
                    onPress={handleRequestToken} 
                  />
                </View>

                <TouchableOpacity 
                  style={styles.switchStepBtn}
                  onPress={() => setStep('reset')}
                >
                  <Text style={styles.switchStepText}>Já possui um código? Clique aqui</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.title}>Definir Nova Senha</Text>
                  <Text style={styles.subtitle}>
                    Informe o código de recuperação e cadastre uma nova senha com no mínimo 8 dígitos.
                  </Text>
                </View>

                <View style={styles.inputsContainer}>
                  <Input 
                    label="E-mail" 
                    placeholder="seu.email@bipescola.com" 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <Input 
                    label="Código / Token de Recuperação" 
                    placeholder="Cole o código aqui" 
                    value={token}
                    onChangeText={setToken}
                    autoCapitalize="none"
                  />
                  <Input 
                    label="Nova Senha (Mínimo 8 caracteres)" 
                    placeholder="••••••••" 
                    isPassword 
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <Input 
                    label="Confirmar Nova Senha" 
                    placeholder="••••••••" 
                    isPassword 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Button 
                    title="Confirmar Nova Senha" 
                    loading={loading}
                    onPress={handleResetPassword} 
                  />
                </View>

                <TouchableOpacity 
                  style={styles.switchStepBtn}
                  onPress={() => setStep('request')}
                >
                  <Text style={styles.switchStepText}>Não tem código? Solicitar novamente</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 55,
  },
  formCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  headerTextContainer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  inputsContainer: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.sm,
  },
  switchStepBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  switchStepText: {
    fontSize: 13,
    fontFamily: 'Roboto_500Medium',
    color: colors.primary,
    fontWeight: '600',
  },
});
