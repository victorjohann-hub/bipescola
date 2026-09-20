import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RadioGroup = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={styles.radioGroupContainer}>
      {options.map((option) => (
        <TouchableOpacity 
          key={option.value} 
          style={styles.radioOption}
          onPress={() => onSelect(option.value)}
        >
          <View style={[styles.radioCircle, selectedValue === option.value && styles.radioCircleSelected]}>
            {selectedValue === option.value && <View style={styles.radioInnerCircle} />}
          </View>
          <Text style={styles.radioText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const EvaluationCreateScreen = () => {
  const navigation = useNavigation();
  const [grade1, setGrade1] = useState(5);
  const [grade2, setGrade2] = useState(null);

  const radioOptions = [
    { label: 'botão', value: 1 },
    { label: 'botão', value: 2 },
    { label: 'botão', value: 3 },
    { label: 'botão', value: 4 },
    { label: 'botão', value: 5 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avaliações do Aluno</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
          <Feather name="chevron-right" size={20} color="#D92D20" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Criar Avaliação</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quem vai receber?</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Aluno X" placeholderTextColor="#8B7500" editable={false} />
            <Feather name="chevron-down" size={20} color="#8B7500" style={styles.icon} />
          </View>
        </View>

        {/* Aspecto 1 */}
        <View style={styles.aspectSection}>
          <Text style={styles.aspectTitle}>Aspecto 1</Text>
          
          <Text style={styles.label}>Nota</Text>
          <RadioGroup options={radioOptions} selectedValue={grade1} onSelect={setGrade1} />

          <Text style={styles.label}>Comentário</Text>
          <View style={styles.textAreaContainer}>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Insira aqui" 
              placeholderTextColor="#B8860B"
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Aspecto 2 */}
        <View style={styles.aspectSection}>
          <Text style={styles.aspectTitle}>Aspecto 2</Text>
          
          <Text style={styles.label}>Nota</Text>
          <RadioGroup options={radioOptions} selectedValue={grade2} onSelect={setGrade2} />

          <Text style={styles.label}>Comentário</Text>
          <View style={styles.textAreaContainer}>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Insira aqui" 
              placeholderTextColor="#B8860B"
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
    color: '#8B7500',
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
    paddingBottom: 100,
  },
  screenTitle: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#FDE68A', // Amarelo claro (bg dos campos)
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B8860B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#8B7500',
  },
  icon: {
    marginLeft: 8,
  },
  aspectSection: {
    marginBottom: 32,
  },
  aspectTitle: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500',
    marginBottom: 16,
  },
  radioGroupContainer: {
    marginBottom: 16,
    marginLeft: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B7500',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#8B7500',
    backgroundColor: '#8B7500',
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#8B7500', // Dourado interno se precisar, mas preenchido fica melhor
  },
  radioText: {
    fontSize: 14,
    color: '#8B7500',
  },
  textAreaContainer: {
    backgroundColor: '#FDE68A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B8860B',
    height: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textArea: {
    height: '100%',
  },
});
