import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EvaluationScale } from '../components/EvaluationScale';
import { EvaluationTable } from '../components/EvaluationTable';
import { EvaluationCard } from '../components/EvaluationCard';

const MOCK_EVALUATIONS = [
  {
    id: '1',
    authorName: 'Rodrigo Costa',
    authorRole: 'Professor',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    aspect: 'Aspecto X',
    grade: 5,
    comment: 'Feedback inicial que serve para orientar o desenvolvimento futuro e identificar pontos fracos.',
    date: '12 de dez. 2026',
  },
  {
    id: '2',
    authorName: 'Sara Soares',
    authorRole: 'Professora',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    aspect: 'Aspecto Y',
    grade: 5,
    comment: 'Feedback inicial que serve para orientar o desenvolvimento futuro e identificar pontos fracos.',
    date: '12 de dez. 2026',
  },
  {
    id: '3',
    authorName: 'Larissa Sato',
    authorRole: 'Professora',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    aspect: 'Aspecto Z',
    grade: 5,
    comment: 'Feedback inicial que serve para orientar o desenvolvimento futuro e identificar pontos fracos.',
    date: '12 de dez. 2026',
  },
];

const MOCK_CLASSES = [
  'nome', 'nome', 'nome', 'nome', 'nome', 'nome', 'nome', 'nome', 'nome', 'nome'
];

export const EvaluationListScreen = () => {
  const navigation = useNavigation();
  // Role mock: clique no título para alternar entre PARENT e TEACHER
  const [role, setRole] = useState('PARENT');
  const [selectedClassIndex, setSelectedClassIndex] = useState(2); // Mock seleção

  const renderParentView = () => (
    <View style={styles.contentPadding}>
      <EvaluationScale />
      <EvaluationTable />
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Aluno X</Text>
          <Feather name="chevron-down" size={16} color="#8B7500" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Semestre X</Text>
          <Feather name="chevron-down" size={16} color="#8B7500" />
        </TouchableOpacity>
      </View>

      {MOCK_EVALUATIONS.map(evalItem => (
        <EvaluationCard key={evalItem.id} evaluation={evalItem} />
      ))}
    </View>
  );

  const renderTeacherView = () => (
    <View style={styles.contentPadding}>
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={() => navigation.navigate('EvaluationCreate')}
      >
        <Text style={styles.createButtonText}>Criar nova Avaliação</Text>
        <Feather name="plus" size={20} color="#8B7500" />
      </TouchableOpacity>

      <View style={styles.teacherHeader}>
        <Text style={styles.teacherTitle}>Professor</Text>
        <Text style={styles.teacherName}>Professor X</Text>
      </View>

      <Text style={styles.classesTitle}>Turmas</Text>
      <Text style={styles.classesSubtitle}>Selecione uma turma:</Text>

      <View style={styles.classesList}>
        {MOCK_CLASSES.map((className, index) => (
          <TouchableOpacity 
            key={index.toString()} 
            style={[
              styles.classItem, 
              selectedClassIndex === index && styles.classItemSelected
            ]}
            onPress={() => setSelectedClassIndex(index)}
          >
            <Text style={styles.classItemText}>{className}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setRole(role === 'PARENT' ? 'TEACHER' : 'PARENT')}>
          <Text style={styles.headerTitle}>Avaliações do Aluno</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {role === 'PARENT' ? renderParentView() : renderTeacherView()}
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
    color: '#8B7500', // Dourado escuro
  },
  scrollContent: {
    paddingBottom: 100, // Espaço para BottomTabs
  },
  contentPadding: {
    padding: 24,
  },
  filtersContainer: {
    marginBottom: 24,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B7500',
    marginRight: 4,
  },
  // Teacher View Styles
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  createButtonText: {
    fontSize: 16,
    color: '#8B7500',
    fontWeight: 'bold',
    marginRight: 8,
  },
  teacherHeader: {
    marginBottom: 24,
  },
  teacherTitle: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500',
    marginBottom: 8,
  },
  teacherName: {
    fontSize: 14,
    color: '#8B7500',
  },
  classesTitle: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500',
    marginBottom: 4,
  },
  classesSubtitle: {
    fontSize: 12,
    color: '#B8860B',
    marginBottom: 16,
  },
  classesList: {
    marginTop: 8,
  },
  classItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  classItemSelected: {
    backgroundColor: '#FDE68A', // Background amarelo claro do item selecionado
  },
  classItemText: {
    fontSize: 14,
    color: '#8B7500',
  },
});
