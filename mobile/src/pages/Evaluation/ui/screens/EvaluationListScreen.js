import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EvaluationScale } from '../components/EvaluationScale';
import { EvaluationTable } from '../components/EvaluationTable';
import { EvaluationCard } from '../components/EvaluationCard';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

const MOCK_EVALUATIONS = [
  {
    id: '1',
    authorName: 'Prof. Rodrigo Costa',
    authorRole: 'Matemática e Raciocínio',
    avatarUrl: 'https://ui-avatars.com/api/?name=Rodrigo+Costa&background=C25E00&color=fff',
    aspect: 'Participação & Engajamento',
    grade: 5,
    comment: 'Demonstra grande curiosidade durante os exercícios em grupo e colabora com os colegas.',
    date: '12 de out. 2026',
  },
  {
    id: '2',
    authorName: 'Profa. Sara Soares',
    authorRole: 'Língua Portuguesa',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sara+Soares&background=2E7D32&color=fff',
    aspect: 'Expressão Verbal & Leitura',
    grade: 4,
    comment: 'Boa interpretação de texto, com excelente leitura em voz alta. Estimular escrita criativa.',
    date: '10 de out. 2026',
  },
  {
    id: '3',
    authorName: 'Profa. Larissa Sato',
    authorRole: 'Artes & Socialização',
    avatarUrl: 'https://ui-avatars.com/api/?name=Larissa+Sato&background=0B3B60&color=fff',
    aspect: 'Trabalho em Equipe',
    grade: 5,
    comment: 'Participativo e atento às orientações da turma nas atividades manuais.',
    date: '05 de out. 2026',
  },
];

const REAL_CLASSES = [
  '1º Ano A - Matutino',
  '1º Ano B - Vespertino',
  '2º Ano A - Matutino',
  '3º Ano A - Matutino',
];

export const EvaluationListScreen = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState('PARENT');
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);

  const renderParentView = () => (
    <View style={styles.contentPadding}>
      <View style={styles.infoBanner}>
        <Feather name="info" size={18} color={colors.accent} />
        <Text style={styles.infoBannerText}>
          Boletim pedagógico descritivo do estudante
        </Text>
      </View>

      <EvaluationScale />
      <EvaluationTable />
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
          <Feather name="user" size={16} color={colors.accent} style={{ marginRight: 6 }} />
          <Text style={styles.dropdownText}>Aluno: João Silva</Text>
          <Feather name="chevron-down" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
          <Feather name="calendar" size={16} color={colors.accent} style={{ marginRight: 6 }} />
          <Text style={styles.dropdownText}>2º Semestre Letivo</Text>
          <Feather name="chevron-down" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Pareceres dos Professores</Text>

      {MOCK_EVALUATIONS.map((evalItem) => (
        <EvaluationCard key={evalItem.id} evaluation={evalItem} />
      ))}
    </View>
  );

  const renderTeacherView = () => (
    <View style={styles.contentPadding}>
      <TouchableOpacity 
        style={styles.createButton} 
        activeOpacity={0.75}
        onPress={() => navigation.navigate('EvaluationCreate')}
      >
        <Feather name="plus-circle" size={20} color={colors.accent} />
        <Text style={styles.createButtonText}>Lançar Nova Avaliação</Text>
      </TouchableOpacity>

      <View style={styles.teacherHeader}>
        <Text style={styles.teacherTitle}>Turmas sob Orientação</Text>
        <Text style={styles.teacherSubtitle}>Selecione uma turma para consultar os alunos:</Text>
      </View>

      <View style={styles.classesList}>
        {REAL_CLASSES.map((className, index) => {
          const isSelected = selectedClassIndex === index;
          return (
            <TouchableOpacity 
              key={index.toString()} 
              activeOpacity={0.7}
              style={[
                styles.classItem, 
                isSelected && styles.classItemSelected
              ]}
              onPress={() => setSelectedClassIndex(index)}
            >
              <Feather 
                name={isSelected ? "check-circle" : "circle"} 
                size={18} 
                color={isSelected ? colors.accent : colors.textMuted} 
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.classItemText, isSelected && styles.classItemTextSelected]}>
                {className}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Avaliações do Aluno</Text>
          <Text style={styles.headerSubtitle}>Acompanhamento de desenvolvimento</Text>
        </View>

        {/* Alternador de visualização rápida */}
        <TouchableOpacity 
          style={styles.roleToggle}
          onPress={() => setRole(role === 'PARENT' ? 'TEACHER' : 'PARENT')}
        >
          <Text style={styles.roleToggleText}>
            {role === 'PARENT' ? 'Visão: Pais' : 'Visão: Prof'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {role === 'PARENT' ? renderParentView() : renderTeacherView()}
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: spacing.md,
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
  roleToggle: {
    backgroundColor: colors.accentSurface,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accentLight,
  },
  roleToggleText: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    color: colors.accent,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl * 2,
  },
  contentPadding: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSurface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accentLight,
    gap: spacing.sm,
  },
  infoBannerText: {
    ...typography.body,
    color: colors.accent,
    fontWeight: '500',
    flex: 1,
  },
  filtersContainer: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'space-between',
  },
  dropdownText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  sectionHeader: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    gap: spacing.sm,
    minHeight: 48,
    ...shadows.subtle,
  },
  createButtonText: {
    ...typography.bodyMedium,
    color: colors.accent,
    fontWeight: '700',
  },
  teacherHeader: {
    marginTop: spacing.sm,
  },
  teacherTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  teacherSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  classesList: {
    gap: spacing.sm,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  classItemSelected: {
    backgroundColor: colors.accentSurface,
    borderColor: colors.accent,
  },
  classItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  classItemTextSelected: {
    fontWeight: '700',
    color: colors.accent,
  },
});
