import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const NoticeCreateScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avisos</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
          <Feather name="chevron-right" size={20} color="#D92D20" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Criar Aviso</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Assunto</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Turma N" placeholderTextColor="#666" editable={false} />
            <Feather name="chevron-down" size={20} color="#8B1A1A" style={styles.icon} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Assunto</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Todos" placeholderTextColor="#666" editable={false} />
            <Feather name="chevron-down" size={20} color="#8B1A1A" style={styles.icon} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Assunto</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Assunto X" placeholderTextColor="#666" editable={false} />
            <Feather name="chevron-down" size={20} color="#8B1A1A" style={styles.icon} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Assunto</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Insira aqui" 
              placeholderTextColor="#F06292"
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B1A1A',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#D92D20',
    fontSize: 12,
    marginRight: 4,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  screenTitle: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B1A1A',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B1A1A',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F8BBD0', // Rosa claro dos inputs
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F06292',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  icon: {
    marginLeft: 8,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    height: '100%',
  },
});
