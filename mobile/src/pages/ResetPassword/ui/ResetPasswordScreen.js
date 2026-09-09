import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@shared/ui/Input/Input';
import { Button } from '@shared/ui/Button/Button';

export const ResetPasswordScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Redefinir senha</Text>
              <Text style={styles.subtitle}>Adicione a nova senha para continuar o login</Text>
            </View>

            <View style={styles.inputsContainer}>
              <Input label="Nova senha" placeholder="********" isPassword />
              <Input label="Repetir nova senha" placeholder="********" isPassword />
            </View>
          </View>

          {/* Button Section */}
          <View style={styles.buttonContainer}>
            <Button title="Redefinir senha" onPress={() => console.log('Reset password pressed')} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  logoImage: {
    width: 200,
    height: 80,
  },
  formContainer: {
    width: '100%',
    marginBottom: 48,
  },
  headerTextContainer: {
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Roboto_300Light',
    color: '#000000',
  },
  inputsContainer: {
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
});
