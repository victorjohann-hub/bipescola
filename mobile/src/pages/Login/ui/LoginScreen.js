import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Input } from '@shared/ui/Input/Input';
import { Button } from '@shared/ui/Button/Button';

export const LoginScreen = ({ navigation }) => {
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
              <Text style={styles.title}>Fazer Login</Text>
              <Text style={styles.subtitle}>Faça login para obter acesso ao aplicativo</Text>
            </View>

            <View style={styles.inputsContainer}>
              <Input label="CPF" placeholder="exemplo" keyboardType="numeric" />
              <Input label="Senha" placeholder="exemplo" isPassword />
            </View>

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>

          {/* Button Section */}
          <View style={styles.buttonContainer}>
            <Button title="Fazer login" onPress={() => navigation.navigate('Main')} />
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
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#02386A',
    fontSize: 14,
    fontFamily: 'Inter_300Light',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
});
