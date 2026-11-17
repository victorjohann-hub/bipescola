import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Feather } from "@expo/vector-icons";
import {
  listClassesAPI,
  createClassAPI,
  updateClassAPI,
  deleteClassAPI,
} from "@shared/api/adminApi";
import { Input } from "@shared/ui/Input/Input";
import { Button } from "@shared/ui/Button/Button";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

export const ClassManagementScreen = ({ navigation }) => {
  const { isTablet, gridColumns } = useResponsiveLayout();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listClassesAPI();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setClasses(list);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      Alert.alert("Erro", error.message || "Falha ao buscar turmas no servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setEditingClass(null);
    setNome("");
    setModalVisible(true);
  };

  const openEditModal = (turma) => {
    setEditingClass(turma);
    setNome(turma.nome || "");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", 'Informe o nome da turma (ex: "1º Ano A").');
      return;
    }

    try {
      setSaving(true);
      if (editingClass) {
        await updateClassAPI(editingClass.id, { nome: nome.trim() });
        Alert.alert("Sucesso", "Turma atualizada com sucesso!");
      } else {
        await createClassAPI({ nome: nome.trim() });
        Alert.alert("Sucesso", "Nova turma cadastrada com sucesso!");
      }
      setModalVisible(false);
      fetchClasses();
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao salvar turma.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (turma) => {
    Alert.alert(
      "Excluir Turma",
      `Deseja realmente excluir a turma "${turma.nome}"?\n\nTurmas com estudantes matriculados não podem ser excluídas.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteClassAPI(turma.id);
              Alert.alert("Sucesso", "Turma excluída com sucesso!");
              fetchClasses();
            } catch (error) {
              Alert.alert(
                "Erro ao excluir",
                error.message || "Não foi possível remover a turma."
              );
            }
          },
        },
      ]
    );
  };

  const filteredClasses = classes.filter((item) =>
    item.nome?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={[styles.classCard, isTablet && styles.classCardTablet]}>
      <View style={styles.cardLeft}>
        <View style={styles.iconCircle}>
          <Feather name="layers" size={22} color={colors.accent} />
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.className} numberOfLines={1}>
            {item.nome}
          </Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === "inativa"
                      ? colors.errorSurface
                      : colors.secondarySurface,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.status === "inativa"
                        ? colors.error
                        : colors.secondary,
                  },
                ]}
              >
                {item.status === "inativa" ? "Inativa" : "Ativa"}
              </Text>
            </View>
            {item.data_criacao && (
              <Text style={styles.dateText}>
                {item.data_criacao.split("T")[0].split("-").reverse().join("/")}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionIconBtn}
          activeOpacity={0.7}
          onPress={() => openEditModal(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="edit-2" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionIconBtn,
            { backgroundColor: colors.errorSurface },
          ]}
          activeOpacity={0.7}
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="trash-2" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Gerenciar Turmas</Text>
            <Text style={styles.headerSubtitle}>
              Crie, edite e organize as turmas da instituição ({filteredClasses.length})
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={openCreateModal}
        >
          <Feather name="plus" size={18} color={colors.textInverse} />
          <Text style={styles.createButtonText}>Nova Turma</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={18}
            color={colors.textMuted}
            style={{ marginRight: spacing.sm }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome da turma..."
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

        {loading && !refreshing ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Carregando turmas...</Text>
          </View>
        ) : filteredClasses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Feather name="layers" size={40} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma turma encontrada</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Nenhuma turma coincide com os termos pesquisados."
                : "Cadastre a primeira turma para começar a organizar as salas e alunos."}
            </Text>
            {!searchQuery && (
              <Button
                title="+ Cadastrar Primeira Turma"
                onPress={openCreateModal}
                style={{ marginTop: spacing.lg }}
              />
            )}
          </View>
        ) : (
          <FlatList
            key={`classes-grid-${gridColumns}`}
            numColumns={gridColumns}
            columnWrapperStyle={
              gridColumns > 1 ? styles.columnWrapper : undefined
            }
            data={filteredClasses}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.accent]}
                tintColor={colors.accent}
              />
            }
          />
        )}
      </View>

      {/* Modal Criar / Editar Turma */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingClass ? "Editar Turma" : "Cadastrar Nova Turma"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Nome da Turma"
              placeholder="Ex: 1º Ano A, 2º Ano B, Berçário II"
              value={nome}
              onChangeText={setNome}
              autoFocus
            />

            <View style={styles.modalButtonContainer}>
              <Button
                title={editingClass ? "Salvar Alterações" : "Criar Turma"}
                loading={saving}
                onPress={handleSave}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  backButton: {
    minWidth: 40,
    minHeight: 40,
    justifyContent: "center",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: 6,
  },
  createButtonText: {
    ...typography.captionBold,
    color: colors.textInverse,
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: "100%",
  },
  listContent: {
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.sm,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  classCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.card,
  },
  classCardTablet: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSurface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  className: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.modal,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  modalButtonContainer: {
    marginTop: spacing.md,
  },
});
