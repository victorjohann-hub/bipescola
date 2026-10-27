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
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Feather } from "@expo/vector-icons";
import { listStudentsAPI, listClassesAPI } from "@shared/api/adminApi";
import { markAttendanceAPI } from "@shared/api/schoolApi";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";
import { playCheckinBeep } from "@shared/utils/soundPlayer";

export const ClassListScreen = ({ navigation }) => {
  const { isTablet } = useResponsiveLayout();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estado local da sessão para feedback 1-Tap imediato (presente | falta | saving)
  const [sessionMarks, setSessionMarks] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        listStudentsAPI(),
        listClassesAPI().catch(() => ({ data: [] })),
      ]);

      setStudents(
        studentsRes?.data || (Array.isArray(studentsRes) ? studentsRes : [])
      );
      const classesList =
        classesRes?.data || (Array.isArray(classesRes) ? classesRes : []);
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

  const submitAttendance = async (aluno_id, presente, silentSuccess = false) => {
    const today = new Date().toISOString().split("T")[0];
    setSessionMarks((prev) => ({ ...prev, [aluno_id]: "saving" }));
    try {
      await markAttendanceAPI({ aluno_id, data: today, presente });
      if (presente) {
        playCheckinBeep();
      }
      setSessionMarks((prev) => ({
        ...prev,
        [aluno_id]: presente ? "presente" : "falta",
      }));
      if (!silentSuccess) {
        Alert.alert(
          "Sucesso",
          `Registro salvo no banco: ${presente ? "Presente" : "Falta"}`
        );
      }
    } catch (error) {
      setSessionMarks((prev) => {
        const copy = { ...prev };
        delete copy[aluno_id];
        return copy;
      });
      Alert.alert("Aviso", error.message || "Falha ao registrar presença.");
    }
  };

  const handleMarkAttendanceModal = (student) => {
    Alert.alert(
      "Registrar Presença",
      `Lançar status no diário escolar para ${student.nome}:`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Registrar Falta",
          style: "destructive",
          onPress: () => submitAttendance(student.id, false),
        },
        {
          text: "Confirmar Presente",
          onPress: () => submitAttendance(student.id, true),
        },
      ]
    );
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesTurma =
        selectedTurmaId === "ALL" ||
        String(student.turma_id) === String(selectedTurmaId);

      const matchesSearch =
        searchQuery.trim() === "" ||
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
          <Text style={styles.headerSubtitle}>
            Validação diária por estudante e turma ({filteredStudents.length} alunos)
          </Text>
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
        {/* Top Controls Row (Search + Info on Tablet) */}
        <View style={[styles.topControls, isTablet && styles.topControlsTablet]}>
          <View style={[styles.searchBar, isTablet && { flex: 1, marginBottom: 0 }]}>
            <Feather
              name="search"
              size={18}
              color={colors.textMuted}
              style={{ marginRight: spacing.sm }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar aluno por nome ou matrícula..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {!isTablet && (
            <View style={styles.infoBox}>
              <Feather name="check-circle" size={18} color={colors.secondary} />
              <Text style={styles.infoBoxText}>
                Use os botões rápidos de Presença (✓) ou Falta (✕) ao lado de cada aluno.
              </Text>
            </View>
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
                  selectedTurmaId === "ALL" && styles.turmaChipActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedTurmaId("ALL")}
              >
                <Text
                  style={[
                    styles.turmaChipText,
                    selectedTurmaId === "ALL" && styles.turmaChipTextActive,
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

        {/* Lista / Grid de Alunos */}
        {loading ? (
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
              {searchQuery || selectedTurmaId !== "ALL"
                ? "Nenhum estudante encontrado para o filtro selecionado."
                : "Nenhum estudante cadastrado no momento."}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.studentsList,
              isTablet && styles.studentsGridTablet,
            ]}
          >
            {filteredStudents.map((student) => {
              const markState = sessionMarks[student.id];
              const isMarkedPresent = markState === "presente";
              const isMarkedAbsent = markState === "falta";
              const isSaving = markState === "saving";

              return (
                <View
                  key={student.id}
                  style={[
                    styles.studentCard,
                    isTablet && styles.studentCardTablet,
                    isMarkedPresent && styles.studentCardPresent,
                    isMarkedAbsent && styles.studentCardAbsent,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.studentCardMain}
                    activeOpacity={0.75}
                    onPress={() => handleMarkAttendanceModal(student)}
                  >
                    <View
                      style={[
                        styles.avatarCircle,
                        isMarkedPresent && {
                          backgroundColor: colors.secondarySurface,
                        },
                        isMarkedAbsent && {
                          backgroundColor: colors.errorSurface,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarInitial,
                          isMarkedPresent && { color: colors.secondary },
                          isMarkedAbsent && { color: colors.error },
                        ]}
                      >
                        {student.nome ? student.nome.charAt(0).toUpperCase() : "A"}
                      </Text>
                    </View>

                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {student.nome}
                      </Text>

                      <View style={styles.metaRow}>
                        <Text style={styles.studentMeta}>
                          Mat: {student.matricula}
                        </Text>
                        {student.turma_nome && (
                          <View style={styles.turmaBadge}>
                            <Text style={styles.turmaBadgeText}>
                              {student.turma_nome}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.faltasMeta}>
                        Faltas acumuladas: {student.faltas || 0}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Botões Diretos 1-Tap (Experiência Rápida de Diário de Classe) */}
                  <View style={styles.quickActions}>
                    {isSaving ? (
                      <ActivityIndicator size="small" color={colors.secondary} />
                    ) : (
                      <>
                        <TouchableOpacity
                          accessibilityLabel={`Marcar presença para ${student.nome}`}
                          style={[
                            styles.quickBtn,
                            styles.quickBtnPresent,
                            isMarkedPresent && styles.quickBtnPresentActive,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => submitAttendance(student.id, true, true)}
                        >
                          <Feather
                            name="check"
                            size={18}
                            color={
                              isMarkedPresent
                                ? colors.textInverse
                                : colors.secondary
                            }
                          />
                          {isTablet && (
                            <Text
                              style={[
                                styles.quickBtnLabel,
                                {
                                  color: isMarkedPresent
                                    ? colors.textInverse
                                    : colors.secondary,
                                },
                              ]}
                            >
                              Presente
                            </Text>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          accessibilityLabel={`Marcar falta para ${student.nome}`}
                          style={[
                            styles.quickBtn,
                            styles.quickBtnAbsent,
                            isMarkedAbsent && styles.quickBtnAbsentActive,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => submitAttendance(student.id, false, true)}
                        >
                          <Feather
                            name="x"
                            size={18}
                            color={
                              isMarkedAbsent ? colors.textInverse : colors.error
                            }
                          />
                          {isTablet && (
                            <Text
                              style={[
                                styles.quickBtnLabel,
                                {
                                  color: isMarkedAbsent
                                    ? colors.textInverse
                                    : colors.error,
                                },
                              ]}
                            >
                              Falta
                            </Text>
                          )}
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    padding: spacing.xs,
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.secondarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  topControls: {
    marginBottom: spacing.md,
  },
  topControlsTablet: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondarySurface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  infoBoxText: {
    ...typography.caption,
    color: colors.secondary,
    flex: 1,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  turmasSection: {
    marginBottom: spacing.lg,
  },
  turmasLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  turmasRow: {
    gap: spacing.sm,
    paddingVertical: 4,
  },
  turmaChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    color: colors.textSecondary,
  },
  turmaChipTextActive: {
    color: colors.textInverse,
    fontWeight: "700",
  },
  studentsList: {
    gap: spacing.sm,
  },
  studentsGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  studentCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.subtle,
  },
  studentCardTablet: {
    width: "48.8%",
    padding: spacing.md + 2,
  },
  studentCardPresent: {
    borderColor: colors.secondary,
    backgroundColor: "#FAFFFA",
  },
  studentCardAbsent: {
    borderColor: colors.error,
    backgroundColor: "#FFFBFB",
  },
  studentCardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primarySurface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarInitial: {
    ...typography.h3,
    color: colors.primary,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: 2,
  },
  studentMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  turmaBadge: {
    backgroundColor: colors.accentSurface,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  turmaBadgeText: {
    fontSize: 11,
    fontFamily: "Roboto_500Medium",
    color: colors.accent,
    fontWeight: "700",
  },
  faltasMeta: {
    fontSize: 11,
    fontFamily: "Roboto_400Regular",
    color: colors.textMuted,
  },
  quickActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  quickBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 42,
    height: 40,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: 4,
  },
  quickBtnPresent: {
    backgroundColor: colors.secondarySurface,
    borderColor: colors.secondary,
  },
  quickBtnPresentActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  quickBtnAbsent: {
    backgroundColor: colors.errorSurface,
    borderColor: colors.error,
  },
  quickBtnAbsentActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  quickBtnLabel: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});
