import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from "@expo/vector-icons";
import { listStudentsAPI } from '@shared/api/adminApi';
import { markAttendanceAPI } from '@shared/api/schoolApi';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

export const ClassListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await listStudentsAPI();
      setStudents(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar alunos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
          <Text style={styles.headerSubtitle}>Validação diária por estudante</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Feather name="check-circle" size={18} color={colors.secondary} />
          <Text style={styles.infoBoxText}>
            Toque no aluno para confirmar a presença ou lançar falta no banco de dados.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: spacing.xl }} />
        ) : students.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="users" size={40} color={colors.textMuted} style={{ marginBottom: spacing.sm }} />
            <Text style={styles.emptyText}>Nenhum aluno cadastrado no sistema.</Text>
          </View>
        ) : (
          <View style={styles.studentsList}>
            {students.map((student) => (
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
                  <Text style={styles.studentMatricula}>Matrícula: {student.matricula}</Text>
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
  studentMatricula: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
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
