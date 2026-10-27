import React, { useState, useEffect, useMemo } from "react";
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
  Platform,
  TextInput,
} from "react-native";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Feather } from "@expo/vector-icons";
import {
  listUsersAPI,
  deleteUserAPI,
  updateUserAPI,
} from "@shared/api/adminApi";
import { Input } from "@shared/ui/Input/Input";
import { Button } from "@shared/ui/Button/Button";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

export const UserManagementScreen = ({ navigation }) => {
  const { isTablet, listColumns } = useResponsiveLayout();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("PARENT");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await listUsersAPI();
      setUsers(res.data || []);
    } catch (error) {
      Alert.alert("Erro", "Falha ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditNome(user.nome || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "PARENT");
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editNome || !editEmail) {
      Alert.alert("Atenção", "Nome e email são obrigatórios.");
      return;
    }
    try {
      setSavingEdit(true);
      await updateUserAPI(editingUser.id, {
        nome: editNome,
        email: editEmail,
        role: editRole,
      });
      Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
      setEditModalVisible(false);
      fetchUsers();
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao atualizar usuário");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = (id, nome) => {
    Alert.alert("Atenção", `Deseja realmente excluir ${nome}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUserAPI(id);
            Alert.alert("Sucesso", "Usuário excluído!");
            fetchUsers();
          } catch (error) {
            Alert.alert("Erro", error.message || "Falha ao excluir");
          }
        },
      },
    ]);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADM":
        return {
          label: "Administrador",
          bg: colors.highlightSurface,
          text: colors.highlight,
        };
      case "PROF":
        return {
          label: "Professor",
          bg: colors.secondarySurface,
          text: colors.secondary,
        };
      case "PORTEIRO":
        return {
          label: "Porteiro",
          bg: colors.warningSurface,
          text: colors.warning,
        };
      case "PARENT":
        return {
          label: "Responsável",
          bg: colors.primarySurface,
          text: colors.primary,
        };
      default:
        return {
          label: role || "Usuário",
          bg: colors.surface,
          text: colors.textSecondary,
        };
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.nome?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const renderItem = ({ item }) => {
    const badge = getRoleBadge(item.role);

    return (
      <View style={[styles.card, isTablet && styles.cardTablet]}>
        <View style={styles.cardInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {item.nome}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {item.email}
          </Text>

          <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.roleText, { color: badge.text }]}>
              {badge.label}
            </Text>
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
          <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
          <Text style={styles.headerSubtitle}>
            Lista de Professores, Porteiros, Pais e Admins ({filteredUsers.length})
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={18}
          color={colors.textMuted}
          style={{ marginRight: spacing.sm }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuário por nome, e-mail ou cargo..."
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

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: spacing.xl }}
        />
      ) : (
        <FlatList
          key={`users-grid-${listColumns}`}
          numColumns={listColumns}
          columnWrapperStyle={
            listColumns > 1 ? styles.columnWrapper : undefined
          }
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          }
        />
      )}

      {/* Modal de Edição Real */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Usuário</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label="Nome Completo"
                value={editNome}
                onChangeText={setEditNome}
                placeholder="Nome do usuário"
              />

              <Input
                label="Email"
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="email@escola.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.rolePickerLabel}>Perfil de Acesso</Text>
              <View style={styles.rolePickerContainer}>
                {[
                  { id: "ADM", label: "Admin" },
                  { id: "PROF", label: "Professor" },
                  { id: "PORTEIRO", label: "Porteiro" },
                  { id: "PARENT", label: "Responsável" },
                ].map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    style={[
                      styles.roleOption,
                      editRole === r.id && styles.roleOptionSelected,
                    ]}
                    onPress={() => setEditRole(r.id)}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        editRole === r.id && styles.roleOptionTextSelected,
                      ]}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Salvar Alterações"
                  loading={savingEdit}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: "100%",
  },
  listContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.card,
  },
  cardTablet: {
    flex: 1,
  },
  cardInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  email: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  roleText: {
    fontSize: 11,
    fontFamily: "Roboto_500Medium",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  actionBtn: {
    minWidth: 42,
    minHeight: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: colors.errorSurface,
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.xl,
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
    maxWidth: 500,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.modal,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  rolePickerLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  rolePickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  roleOption: {
    flex: 1,
    minWidth: "45%",
    minHeight: 42,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
  },
  roleOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  roleOptionText: {
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
    color: colors.textSecondary,
  },
  roleOptionTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  modalActions: {
    marginTop: spacing.md,
  },
});
