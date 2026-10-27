import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Input } from '@shared/ui/Input/Input';
import { Button } from '@shared/ui/Button/Button';
import { loginUserAPI } from '@shared/api/userApi';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('@bipescola_token');
        if (token) {
          navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        }
      } catch (e) {}
      setCheckingAuth(false);
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      const response = await loginUserAPI({ email, senha });
      
      await AsyncStorage.setItem('@bipescola_token', response.token);
      await AsyncStorage.setItem('@bipescola_user', JSON.stringify(response.user));
      
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      Alert.alert('Erro no Login', error.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../../assets/logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Acesso ao BIP Escola</Text>
              <Text style={styles.subtitle}>Digite suas credenciais institucionais para continuar</Text>
            </View>

            <View style={styles.inputsContainer}>
              <Input 
                label="E-mail" 
                placeholder="seu.email@bipescola.com" 
                keyboardType="email-address" 
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <Input 
                label="Senha de Acesso" 
                placeholder="••••••••" 
                isPassword 
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => navigation.navigate('ResetPassword')}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <Button 
                title="Entrar no Sistema" 
                loading={loading}
                onPress={handleLogin} 
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  logoImage: {
    width: 220,
    height: 70,
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
    marginBottom: spacing.xs,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    minHeight: 24,
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: 'Roboto_500Medium',
    color: colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
  },
});
