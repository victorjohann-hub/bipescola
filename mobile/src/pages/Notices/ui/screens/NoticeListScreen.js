import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { NoticeCard } from "../components/NoticeCard";
import { listPostsAPI } from "@shared/api/schoolApi";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

export const NoticeListScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { isTablet, listColumns } = useResponsiveLayout();
  const [role, setRole] = useState("PARENT");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const userStr = await AsyncStorage.getItem("@bipescola_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setRole(user.role);
        }

        const res = await listPostsAPI();
        setPosts(res || []);
      } catch (error) {
        console.error("Erro ao carregar avisos", error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchPosts();
    }
  }, [isFocused]);

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {!isTablet && role !== "PARENT" && (
        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.75}
          onPress={() => navigation.navigate("NoticeCreate")}
        >
          <Feather name="plus-circle" size={20} color={colors.notice} />
          <Text style={styles.createButtonText}>Criar Novo Aviso</Text>
        </TouchableOpacity>
      )}

      <View style={styles.filterRow}>
        <View style={styles.filterChip}>
          <Feather name="clock" size={14} color={colors.notice} />
          <Text style={styles.filterChipText}>
            Publicações Recentes ({posts.length})
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mural de Avisos</Text>
          <Text style={styles.headerSubtitle}>
            Comunicados oficiais e informações da escola
          </Text>
        </View>

        {isTablet && role !== "PARENT" && (
          <TouchableOpacity
            style={styles.tabletHeaderCreateBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("NoticeCreate")}
          >
            <Feather name="plus-circle" size={18} color={colors.textInverse} />
            <Text style={styles.tabletHeaderCreateBtnText}>
              Novo Comunicado
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.notice}
          style={{ marginTop: spacing.xl }}
        />
      ) : (
        <FlatList
          key={`notices-grid-${listColumns}`}
          numColumns={listColumns}
          columnWrapperStyle={
            listColumns > 1 ? styles.columnWrapper : undefined
          }
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NoticeCard
              style={isTablet ? styles.tabletCardItem : undefined}
              notice={{
                id: item.id.toString(),
                authorName: item.autor_nome || "Coordenação Escolar",
                authorRole: "Comunicado Oficial",
                avatarUrl:
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(item.autor_nome || "BIP Escola") +
                  "&background=C2185B&color=fff",
                subject: item.titulo,
                content: item.conteudo,
                destinatario_nome: item.destinatario_nome,
                date: item.data_criacao
                  ? new Date(item.data_criacao).toLocaleDateString("pt-BR")
                  : "Hoje",
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather
                name="bell-off"
                size={40}
                color={colors.textMuted}
                style={{ marginBottom: spacing.sm }}
              />
              <Text style={styles.emptyText}>
                Nenhum comunicado publicado no momento.
              </Text>
            </View>
          }
        />
      )}
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
  tabletHeaderCreateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.notice,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    gap: spacing.xs,
    ...shadows.subtle,
  },
  tabletHeaderCreateBtnText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    color: colors.textInverse,
    fontWeight: "700",
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  tabletCardItem: {
    flex: 1,
  },
  listHeader: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.notice,
    gap: spacing.sm,
    minHeight: 48,
    ...shadows.subtle,
  },
  createButtonText: {
    ...typography.bodyMedium,
    color: colors.notice,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.noticeSurface,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    gap: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
    color: colors.notice,
    fontWeight: "600",
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
