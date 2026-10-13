import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@shared/ui/Button/Button';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

const RadioGradeSelector = ({ selectedValue, onSelect }) => {
  const grades = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  return (
    <View style={styles.gradeContainer}>
      {grades.map((item) => {
        const isSelected = selectedValue === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            activeOpacity={0.7}
            style={[
              styles.gradeCircle,
              isSelected && styles.gradeCircleSelected,
            ]}
            onPress={() => onSelect(item.value)}
          >
            <Text style={[styles.gradeText, isSelected && styles.gradeTextSelected]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const EvaluationCreateScreen = () => {
  const navigation = useNavigation();
  const [alunoNome, setAlunoNome] = useState('Joãozinho da Silva');
  const [grade1, setGrade1] = useState(5);
  const [comentario1, setComentario1] = useState('');
  const [grade2, setGrade2] = useState(4);
  const [comentario2, setComentario2] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Avaliação Registrada',
        'Os apontamentos pedagógicos foram salvos com sucesso no boletim.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lançar Avaliação</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenSubtitle}>Registro pedagógico e desenvolvimento do aluno</Text>

        {/* Destinatário */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Estudante Selecionado</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={18} color={colors.accent} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              value={alunoNome} 
              onChangeText={setAlunoNome}
              placeholder="Nome do aluno" 
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* Aspecto 1: Participação & Engajamento */}
        <View style={styles.aspectCard}>
          <View style={styles.aspectHeader}>
            <View style={styles.aspectIconBox}>
              <Feather name="activity" size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aspectTitle}>Participação & Engajamento</Text>
              <Text style={styles.aspectDesc}>Interação em sala de aula e colaboração</Text>
            </View>
          </View>
          
          <Text style={styles.subLabel}>Conceito (1 a 5 estrelas)</Text>
          <RadioGradeSelector selectedValue={grade1} onSelect={setGrade1} />

          <Text style={styles.subLabel}>Parecer Descritivo</Text>
          <View style={styles.textAreaContainer}>
            <TextInput 
              style={styles.textArea} 
              placeholder="Descreva a evolução, facilidades e pontos a melhorar..." 
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              value={comentario1}
              onChangeText={setComentario1}
            />
          </View>
        </View>

        {/* Aspecto 2: Socialização & Autonomia */}
        <View style={styles.aspectCard}>
          <View style={styles.aspectHeader}>
            <View style={styles.aspectIconBox}>
              <Feather name="smile" size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aspectTitle}>Socialização & Convivência</Text>
              <Text style={styles.aspectDesc}>Relações com colegas, empatia e regras</Text>
            </View>
          </View>
          
          <Text style={styles.subLabel}>Conceito (1 a 5 estrelas)</Text>
          <RadioGradeSelector selectedValue={grade2} onSelect={setGrade2} />

          <Text style={styles.subLabel}>Parecer Descritivo</Text>
          <View style={styles.textAreaContainer}>
            <TextInput 
              style={styles.textArea} 
              placeholder="Descreva o comportamento nas atividades em grupo..." 
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              value={comentario2}
              onChangeText={setComentario2}
            />
          </View>
        </View>

        {/* Botão de Envio */}
        <View style={styles.submitSection}>
          <Button
            title="Publicar Avaliação Pedagógica"
            backgroundColor={colors.accent}
            loading={submitting}
            onPress={handleSubmit}
          />
        </View>
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
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.lg,
  },
  screenSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  formGroup: {
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Roboto_500Medium',
  },
  aspectCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  aspectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aspectIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  aspectTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  aspectDesc: {
    ...typography.caption,
    color: colors.textMuted,
  },
  subLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  gradeCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeCircleSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    ...shadows.subtle,
  },
  gradeText: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: colors.textSecondary,
  },
  gradeTextSelected: {
    color: colors.textInverse,
  },
  textAreaContainer: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  textArea: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Roboto_400Regular',
    minHeight: 80,
  },
  submitSection: {
    marginTop: spacing.sm,
  },
});
