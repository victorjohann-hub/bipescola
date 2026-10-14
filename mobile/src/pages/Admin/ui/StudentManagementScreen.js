import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from '@expo/vector-icons';
import { listStudentsAPI, deleteStudentAPI, updateStudentAPI } from '@shared/api/adminApi';
import { Input } from '@shared/ui/Input/Input';
import { Button } from '@shared/ui/Button/Button';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

export const StudentManagementScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado de Edição Real
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editMatricula, setEditMatricula] = useState('');
  const [editStatus, setEditStatus] = useState('ativo');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await listStudentsAPI();
      setStudents(res.data || []);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar alunos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditNome(student.nome || '');
    setEditMatricula(student.matricula || '');
    setEditStatus(student.status || 'ativo');
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editNome || !editMatricula) {
      Alert.alert('Atenção', 'Nome e matrícula são obrigatórios.');
      return;
    }
    try {
      setSavingEdit(true);
      await updateStudentAPI(editingStudent.id, {
        nome: editNome,
        matricula: editMatricula,
        status: editStatus,
        turma_id: editingStudent.turma_id || 1,
      });
      Alert.alert('Sucesso', 'Aluno atualizado com sucesso!');
      setEditModalVisible(false);
      fetchStudents();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao atualizar aluno');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = (id, nome) => {
    Alert.alert('Atenção', `Deseja realmente excluir o aluno ${nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteStudentAPI(id);
            Alert.alert('Sucesso', 'Aluno excluído!');
            fetchStudents();
          } catch (error) {
            Alert.alert('Erro', error.message || 'Falha ao excluir');
          }
        }
      }
    ]);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ativo':
        return { label: 'Ativo', bg: colors.secondarySurface, text: colors.secondary };
      case 'inativo':
        return { label: 'Inativo', bg: colors.errorSurface, text: colors.error };
      case 'transferido':
        return { label: 'Transferido', bg: colors.warningSurface, text: colors.warning };
      default:
        return { label: status || 'Ativo', bg: colors.primarySurface, text: colors.primary };
    }
  };

  const renderItem = ({ item }) => {
    const badge = getStatusBadge(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.details}>Matrícula: {item.matricula}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => openEditModal(item)}
          >
            <Feather name="edit-2" size={18} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]} 
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => handleDelete(item.id, item.nome)}
          >
            <Feather name="trash-2" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ResponsiveContainer style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Gerenciar Alunos</Text>
          <Text style={styles.headerSubtitle}>Lista de Estudantes Matriculados</Text>
        </View>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList 
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>
          }
        />
      )}

      {/* Modal de Edição Real */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Aluno</Text>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label="Nome do Aluno"
                value={editNome}
                onChangeText={setEditNome}
                placeholder="Ex: João da Silva"
              />

              <Input
                label="Matrícula"
                value={editMatricula}
                onChangeText={setEditMatricula}
                placeholder="Ex: MAT2026-001"
              />

              <Text style={styles.statusPickerLabel}>Status do Aluno</Text>
              <View style={styles.statusPickerContainer}>
                {['ativo', 'inativo', 'transferido'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusOption,
                      editStatus === s && styles.statusOptionSelected
                    ]}
                    onPress={() => setEditStatus(s)}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      editStatus === s && styles.statusOptionTextSelected
                    ]}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Salvar Alterações"
                  loading={savingEdit}
                  backgroundColor={colors.secondary}
                  onPress={handleSaveEdit}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
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
  listContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  details: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionBtn: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: colors.errorSurface,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  // Modal de Edição
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statusPickerLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statusPickerContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statusOption: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  statusOptionSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondarySurface,
  },
  statusOptionText: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    color: colors.textSecondary,
  },
  statusOptionTextSelected: {
    color: colors.secondary,
    fontWeight: '700',
  },
  modalActions: {
    marginTop: spacing.md,
  },
});
