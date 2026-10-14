import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from "@expo/vector-icons";
import { listStudentsAPI, listClassesAPI } from '@shared/api/adminApi';
import { markAttendanceAPI } from '@shared/api/schoolApi';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

export const ClassListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        listStudentsAPI(),
        listClassesAPI().catch(() => ({ data: [] })),
      ]);

      setStudents(studentsRes?.data || (Array.isArray(studentsRes) ? studentsRes : []));
      const classesList = classesRes?.data || (Array.isArray(classesRes) ? classesRes : []);
      setClasses(classesList);
    } catch (error) {
      console.error("Erro ao buscar alunos ou turmas", error);
      Alert.alert("Erro", "Falha ao carregar dados escolares.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMarkAttendance = (student) => {
    Alert.alert(
      "Registrar Presença",
      `Lançar status no diário escolar para ${student.nome}:`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Registrar Falta", 
          style: "destructive",
          onPress: () => submitAttendance(student.id, false)
        },
        { 
          text: "Confirmar Presente", 
          onPress: () => submitAttendance(student.id, true)
        }
      ]
    );
  };

  const submitAttendance = async (aluno_id, presente) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await markAttendanceAPI({ aluno_id, data: today, presente });
      Alert.alert('Sucesso', `Registro salvo no banco: ${presente ? 'Presente' : 'Falta'}`);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao registrar presença.');
    }
  };

  // Filtragem combinada por turma selecionada e termo de pesquisa
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesTurma =
        selectedTurmaId === 'ALL' ||
        String(student.turma_id) === String(selectedTurmaId);

      const matchesSearch =
        searchQuery.trim() === '' ||
        student.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.matricula?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTurma && matchesSearch;
    });
  }, [students, selectedTurmaId, searchQuery]);

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={styles.headerTitle}>Chamada Escolar</Text>
          <Text style={styles.headerSubtitle}>Validação diária por estudante e turma</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={onRefresh}
        >
          <Feather name="refresh-cw" size={18} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
      >
        {/* Banner Informativo */}
        <View style={styles.infoBox}>
          <Feather name="check-circle" size={18} color={colors.secondary} />
          <Text style={styles.infoBoxText}>
            Filtre por turma e toque no aluno para registrar a presença ou falta.
          </Text>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar aluno por nome ou matrícula..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Seletor de Turmas (Horizontal Scroll Chips) */}
        {classes.length > 0 && (
          <View style={styles.turmasSection}>
            <Text style={styles.turmasLabel}>Filtrar por Turma:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.turmasRow}
            >
              <TouchableOpacity
                style={[
                  styles.turmaChip,
                  selectedTurmaId === 'ALL' && styles.turmaChipActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedTurmaId('ALL')}
              >
                <Text
                  style={[
                    styles.turmaChipText,
                    selectedTurmaId === 'ALL' && styles.turmaChipTextActive,
                  ]}
                >
                  Todas ({students.length})
                </Text>
              </TouchableOpacity>

              {classes.map((turma) => {
                const count = students.filter(
                  (s) => String(s.turma_id) === String(turma.id)
                ).length;
                const isSelected = String(selectedTurmaId) === String(turma.id);

                return (
                  <TouchableOpacity
                    key={turma.id}
                    style={[
                      styles.turmaChip,
                      isSelected && styles.turmaChipActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedTurmaId(turma.id)}
                  >
                    <Text
                      style={[
                        styles.turmaChipText,
                        isSelected && styles.turmaChipTextActive,
                      ]}
                    >
                      {turma.nome} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color={colors.secondary}
            style={{ marginTop: spacing.xl }}
          />
        ) : filteredStudents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather
              name="users"
              size={40}
              color={colors.textMuted}
              style={{ marginBottom: spacing.sm }}
            />
            <Text style={styles.emptyText}>
              {searchQuery || selectedTurmaId !== 'ALL'
                ? 'Nenhum estudante corresponde aos filtros aplicados.'
                : 'Nenhum aluno cadastrado no sistema.'}
            </Text>
          </View>
        ) : (
          <View style={styles.studentsList}>
            {filteredStudents.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={styles.studentCard}
                activeOpacity={0.7}
                onPress={() => handleMarkAttendance(student)}
              >
                <View style={styles.studentAvatar}>
                  <Feather name="user" size={20} color={colors.secondary} />
                </View>

                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.nome}</Text>
                  <View style={styles.studentMetaRow}>
                    <Text style={styles.studentMatricula}>
                      Matrícula: {student.matricula}
                    </Text>
                    {student.turma_nome ? (
                      <View style={styles.turmaBadge}>
                        <Text style={styles.turmaBadgeText}>{student.turma_nome}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>Lançar</Text>
                  <Feather name="chevron-right" size={16} color={colors.secondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButton: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.secondarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondarySurface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.secondaryLight,
    gap: spacing.sm,
  },
  infoBoxText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '500',
    flex: 1,
    fontSize: 13,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: '100%',
  },
  turmasSection: {
    marginBottom: spacing.xs,
  },
  turmasLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  turmasRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  turmaChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  turmaChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  turmaChipText: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    color: colors.textSecondary,
  },
  turmaChipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  studentsList: {
    gap: spacing.sm,
  },
  studentCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    ...shadows.card,
  },
  studentAvatar: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.secondarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  studentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  studentMatricula: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  turmaBadge: {
    backgroundColor: colors.accentSurface,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  turmaBadgeText: {
    fontSize: 10,
    fontFamily: 'Roboto_700Bold',
    color: colors.accent,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondarySurface,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: 2,
  },
  actionBadgeText: {
    fontSize: 12,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: colors.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
