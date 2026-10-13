import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert } from 'react-native';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from '@expo/vector-icons';
import { Input } from '@shared/ui/Input/Input';
import { Button } from '@shared/ui/Button/Button';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

export const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReset = () => {
    if (!email) {
      Alert.alert('Atenção', 'Informe o e-mail cadastrado na instituição.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas informadas não coincidem.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Solicitação Enviada',
        'Se o e-mail existir no sistema, você receberá as instruções para redefinição de acesso.',
        [{ text: 'Voltar ao Login', onPress: () => navigation.goBack() }]
      );
    }, 600);
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

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../../assets/logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>

          <View style={styles.formCard}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Redefinir Senha</Text>
              <Text style={styles.subtitle}>
                Insira o seu e-mail institucional para redefinir as credenciais de acesso
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
              <Input 
                label="Nova Senha" 
                placeholder="Mínimo de 6 caracteres" 
                isPassword 
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Input 
                label="Confirmação da Nova Senha" 
                placeholder="Repita a nova senha" 
                isPassword 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button 
                title="Confirmar Nova Senha" 
                loading={submitting}
                onPress={handleReset} 
              />
            </View>
          </View>
        </View>
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
    flex: 1,
    paddingHorizontal: spacing.lg,
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
});
