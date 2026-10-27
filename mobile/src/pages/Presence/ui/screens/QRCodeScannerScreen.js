import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Feather } from "@expo/vector-icons";
import { Button } from "@shared/ui/Button/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { markAttendanceAPI } from "@shared/api/schoolApi";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";
import { playCheckinBeep } from "@shared/utils/soundPlayer";

export const QRCodeScannerScreen = ({ navigation }) => {
  const { isTablet } = useResponsiveLayout();
  const [scannedData, setScannedData] = useState("");
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState("back");
  const [submitting, setSubmitting] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  if (!permission) {
    return (
      <ResponsiveContainer style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Text style={styles.loadingText}>Carregando câmera...</Text>
        </View>
      </ResponsiveContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ResponsiveContainer style={styles.safeArea}>
        <View style={styles.centerBox}>
          <View style={styles.permissionCard}>
            <Feather
              name="camera-off"
              size={40}
              color={colors.secondary}
              style={{ marginBottom: spacing.md }}
            />
            <Text style={styles.permissionTitle}>Permissão de Câmera</Text>
            <Text style={styles.permissionDesc}>
              Precisamos de acesso à câmera para escanear o QR Code de identificação dos alunos.
            </Text>
            <Button
              title="Conceder Permissão"
              backgroundColor={colors.secondary}
              onPress={requestPermission}
            />
          </View>
        </View>
      </ResponsiveContainer>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data);
    playCheckinBeep();
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleConfirmPresence = async () => {
    if (!scannedData || !scannedData.startsWith("aluno_")) {
      Alert.alert("Código Inválido", "Código QR inválido! O padrão deve ser aluno_<ID>.");
      return;
    }

    const aluno_id = scannedData.split("_")[1];
    const dataAtual = new Date().toISOString().split("T")[0];
    const horaAtual = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      setSubmitting(true);
      await markAttendanceAPI({ aluno_id, data: dataAtual, presente: true });
      await playCheckinBeep();

      setRecentScans((prev) => [
        {
          id: `${aluno_id}-${Date.now()}`,
          code: scannedData,
          alunoId: aluno_id,
          time: horaAtual,
        },
        ...prev.slice(0, 7),
      ]);

      Alert.alert("Sucesso", "Presença confirmada no sistema!");
      setScannedData("");
      setScanned(false);
    } catch (e) {
      Alert.alert(
        "Erro",
        "Erro ao salvar: " +
          (e.message || "Falha na conexão. Você tem permissão?")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ResponsiveContainer style={styles.safeArea}>
      {/* Header */}
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
            <Text style={styles.headerTitle}>Leitor QR de Presença</Text>
            <Text style={styles.headerSubtitle}>
              {isTablet
                ? "Modo Totem / Portaria • Validação óptica em tempo real"
                : "Aproxime o código QR do estudante"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.cameraSwitchBtn}
          activeOpacity={0.75}
          onPress={toggleCameraFacing}
        >
          <Feather name="refresh-cw" size={16} color={colors.secondary} />
          <Text style={styles.cameraSwitchText}>
            {facing === "back" ? "Câmera Traseira" : "Câmera Frontal"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet && styles.contentTabletSplit,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Painel Esquerdo: Visor da Câmera */}
        <View style={[styles.scannerColumn, isTablet && styles.scannerColumnTablet]}>
          <View style={styles.scannerCard}>
            <Text style={styles.title}>
              Aproxime o QR Code do aluno na moldura
            </Text>

            <View
              style={[
                styles.scannerContainer,
                isTablet && styles.scannerContainerTablet,
              ]}
            >
              {isFocused && (
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  facing={facing}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                />
              )}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {scanned && (
              <TouchableOpacity
                style={styles.rescanChip}
                onPress={() => {
                  setScanned(false);
                  setScannedData("");
                }}
              >
                <Feather name="rotate-ccw" size={15} color={colors.secondary} />
                <Text style={styles.rescanText}>Escanear novamente</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Painel Direito: Confirmação e Registro da Sessão */}
        <View style={[styles.actionColumn, isTablet && styles.actionColumnTablet]}>
          <View style={styles.validationCard}>
            <Text style={styles.sectionTitle}>Dados da Leitura</Text>
            <Text style={styles.sectionDesc}>
              Verifique o código identificado antes de confirmar o acesso
            </Text>

            <View style={styles.inputContainer}>
              <Feather
                name={scannedData ? "check-circle" : "maximize"}
                size={20}
                color={scannedData ? colors.secondary : colors.textMuted}
                style={{ marginRight: spacing.sm }}
              />
              <TextInput
                style={styles.input}
                placeholder="Aguardando leitura (ex: aluno_1)..."
                placeholderTextColor={colors.textMuted}
                value={scannedData}
                onChangeText={setScannedData}
              />
            </View>

            <Button
              title="Confirmar Presença"
              backgroundColor={colors.secondary}
              loading={submitting}
              onPress={handleConfirmPresence}
            />
          </View>

          {/* Histórico Rápido da Sessão (Ideal para Portaria em Tablet) */}
          <View style={styles.sessionLogCard}>
            <View style={styles.sessionLogHeader}>
              <Feather name="clock" size={16} color={colors.primary} />
              <Text style={styles.sessionLogTitle}>
                Últimas Leituras desta Sessão ({recentScans.length})
              </Text>
            </View>

            {recentScans.length === 0 ? (
              <Text style={styles.sessionEmptyText}>
                Nenhuma entrada confirmada ainda nesta sessão.
              </Text>
            ) : (
              recentScans.map((scan) => (
                <View key={scan.id} style={styles.scanRow}>
                  <View style={styles.scanRowLeft}>
                    <View style={styles.scanCheckBadge}>
                      <Feather name="check" size={14} color={colors.secondary} />
                    </View>
                    <View>
                      <Text style={styles.scanCodeText}>
                        Aluno ID #{scan.alunoId} ({scan.code})
                      </Text>
                      <Text style={styles.scanTimeText}>
                        Registrado às {scan.time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.scanStatusPill}>
                    <Text style={styles.scanStatusPillText}>Confirmado</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  permissionCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    maxWidth: 420,
    width: "100%",
    ...shadows.card,
  },
  permissionTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  permissionDesc: {
    ...typography.body,
    textAlign: "center",
    marginBottom: spacing.lg,
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
    flex: 1,
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
  cameraSwitchBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondarySurface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    gap: 6,
  },
  cameraSwitchText: {
    fontSize: 12,
    fontFamily: "Roboto_700Bold",
    color: colors.secondary,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  contentTabletSplit: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  scannerColumn: {
    width: "100%",
  },
  scannerColumnTablet: {
    width: "48%",
  },
  actionColumn: {
    width: "100%",
    gap: spacing.md,
  },
  actionColumnTablet: {
    width: "49%",
  },
  scannerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.card,
  },
  title: {
    ...typography.h3,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  scannerContainer: {
    width: 256,
    height: 256,
    position: "relative",
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  scannerContainerTablet: {
    width: 312,
    height: 312,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: colors.secondaryLight,
  },
  topLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: radius.md,
  },
  topRight: {
    top: 12,
    right: 12,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: radius.md,
  },
  bottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: radius.md,
  },
  bottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: radius.md,
  },
  rescanChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondarySurface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.md,
    gap: 6,
  },
  rescanText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    color: colors.secondary,
  },
  validationCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 2,
  },
  sectionDesc: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondarySurface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: colors.secondary,
  },
  sessionLogCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.subtle,
  },
  sessionLogHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sessionLogTitle: {
    ...typography.label,
    color: colors.primary,
  },
  sessionEmptyText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  scanRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  scanRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  scanCheckBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.secondarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  scanCodeText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    color: colors.textPrimary,
  },
  scanTimeText: {
    fontSize: 11,
    fontFamily: "Roboto_400Regular",
    color: colors.textMuted,
  },
  scanStatusPill: {
    backgroundColor: colors.secondarySurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  scanStatusPillText: {
    fontSize: 11,
    fontFamily: "Roboto_700Bold",
    color: colors.secondary,
  },
});
