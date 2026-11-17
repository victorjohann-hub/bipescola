import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Feather } from "@expo/vector-icons";
import { Button } from "@shared/ui/Button/Button";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { apiClient } from "@shared/api/apiClient";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

export const QRCodeGeneratorScreen = ({ navigation }) => {
  const { isTablet } = useResponsiveLayout();
  const [userData, setUserData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userStr = await AsyncStorage.getItem("@bipescola_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);

          if (user.role === "PARENT") {
            const res = await apiClient(`/students/pai/${user.id}`, {
              method: "GET",
            });
            const list = res?.data || (Array.isArray(res) ? res : []);
            setStudents(list);
            if (list.length > 0) {
              setSelectedStudent(list[0]);
            }
          } else {
            const res = await apiClient("/students", { method: "GET" });
            const list = res?.data || (Array.isArray(res) ? res : []);
            setStudents(list);
            if (list.length > 0) {
              setSelectedStudent(list[0]);
            }
          }
        }
      } catch (e) {
        console.error("Erro ao carregar dados do QR Code:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.nome?.toLowerCase().includes(q) ||
        s.matricula?.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const qrValue = selectedStudent ? `aluno_${selectedStudent.id}` : "";

  const copyToClipboard = async () => {
    if (!qrValue) return;
    await Clipboard.setStringAsync(qrValue);
    Alert.alert("Sucesso", "Código copiado para a área de transferência!");
  };

  const renderBadgeCard = () => (
    <View style={styles.badgeCard}>
      <View style={styles.badgeHeaderStrip}>
        <Feather name="shield" size={16} color={colors.textInverse} />
        <Text style={styles.badgeHeaderText}>
          IDENTIFICAÇÃO ESTUDANTIL • BIP ESCOLA
        </Text>
      </View>

      <View style={styles.qrContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.secondary} />
        ) : qrValue ? (
          <QRCode
            value={qrValue}
            size={isTablet ? 250 : 210}
            color="#0F172A"
            backgroundColor="#FFFFFF"
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="alert-circle" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {userData?.role === "PARENT"
                ? "Nenhum estudante vinculado à sua conta de responsável."
                : "Nenhum aluno cadastrado no sistema."}
            </Text>
          </View>
        )}
      </View>

      {selectedStudent && (
        <View style={styles.studentDetailsBox}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <Text style={styles.studentName} numberOfLines={1}>
              {selectedStudent.nome}
            </Text>
            <Text style={styles.codeLabel}>
              Matrícula: {selectedStudent.matricula} • Turma:{" "}
              {selectedStudent.turma_nome || selectedStudent.turma_id || "Geral"}
            </Text>
            <View style={styles.codePill}>
              <Text style={styles.codeValue}>{qrValue}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={copyToClipboard}
            style={styles.copyIconBtn}
            accessibilityLabel="Copiar código do aluno"
          >
            <Feather name="copy" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      )}

      {selectedStudent && (
        <View style={styles.buttonContainer}>
          <Button
            title="Copiar Código de Identificação"
            backgroundColor={colors.secondary}
            onPress={copyToClipboard}
          />
        </View>
      )}
    </View>
  );

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>QR Code do Aluno</Text>
            <Text style={styles.headerSubtitle}>
              Carteirinha digital para leitura rápida na portaria
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet && students.length > 1 && styles.contentMasterDetail,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Em Tablets com múltiplos alunos: Lista Master na esquerda */}
        {isTablet && students.length > 1 ? (
          <>
            <View style={styles.masterPane}>
              <Text style={styles.masterTitle}>
                Estudantes ({students.length})
              </Text>

              {students.length > 4 && (
                <View style={styles.searchBar}>
                  <Feather
                    name="search"
                    size={16}
                    color={colors.textMuted}
                    style={{ marginRight: spacing.xs }}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Filtrar estudante..."
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              )}

              <View style={styles.masterList}>
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudent?.id === student.id;
                  return (
                    <TouchableOpacity
                      key={student.id}
                      style={[
                        styles.masterItem,
                        isSelected && styles.masterItemActive,
                      ]}
                      activeOpacity={0.75}
                      onPress={() => setSelectedStudent(student)}
                    >
                      <View
                        style={[
                          styles.masterAvatar,
                          isSelected && { backgroundColor: colors.secondary },
                        ]}
                      >
                        <Text
                          style={[
                            styles.masterAvatarText,
                            isSelected && { color: colors.textInverse },
                          ]}
                        >
                          {student.nome?.charAt(0).toUpperCase() || "A"}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.masterItemName,
                            isSelected && { color: colors.secondary },
                          ]}
                          numberOfLines={1}
                        >
                          {student.nome}
                        </Text>
                        <Text style={styles.masterItemSub}>
                          Mat: {student.matricula}
                        </Text>
                      </View>
                      <Feather
                        name="chevron-right"
                        size={18}
                        color={isSelected ? colors.secondary : colors.textMuted}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.detailPane}>{renderBadgeCard()}</View>
          </>
        ) : (
          <View style={styles.singleColumnWrap}>
            {students.length > 1 && (
              <View style={styles.selectorContainer}>
                <Text style={styles.selectorLabel}>
                  Selecione o(a) estudante:
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsContainer}
                >
                  {students.map((student) => {
                    const isSelected = selectedStudent?.id === student.id;
                    return (
                      <TouchableOpacity
                        key={student.id}
                        style={[styles.chip, isSelected && styles.chipActive]}
                        onPress={() => setSelectedStudent(student)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextActive,
                          ]}
                        >
                          {student.nome}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {renderBadgeCard()}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  contentMasterDetail: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  masterPane: {
    width: "38%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.subtle,
  },
  masterTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    height: 40,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  masterList: {
    gap: spacing.xs,
  },
  masterItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "transparent",
    gap: spacing.sm,
  },
  masterItemActive: {
    backgroundColor: colors.secondarySurface,
    borderColor: colors.secondary,
  },
  masterAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  masterAvatarText: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: colors.primary,
  },
  masterItemName: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: colors.textPrimary,
  },
  masterItemSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailPane: {
    flex: 1,
  },
  singleColumnWrap: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  selectorContainer: {
    width: "100%",
    marginBottom: spacing.md,
  },
  selectorLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  chipsContainer: {
    gap: spacing.sm,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textInverse,
    fontWeight: "700",
  },
  badgeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    alignItems: "center",
    paddingBottom: spacing.xl,
    ...shadows.card,
  },
  badgeHeaderStrip: {
    width: "100%",
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  badgeHeaderText: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
    color: colors.textInverse,
    letterSpacing: 0.8,
  },
  qrContainer: {
    marginVertical: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.secondarySurface,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
    minWidth: 240,
  },
  emptyContainer: {
    alignItems: "center",
    padding: spacing.md,
    maxWidth: 220,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  studentDetailsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    width: "88%",
    marginBottom: spacing.lg,
  },
  studentName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  codeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  codePill: {
    backgroundColor: colors.secondarySurface,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  codeValue: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    color: colors.secondary,
  },
  copyIconBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.secondarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "88%",
  },
});
