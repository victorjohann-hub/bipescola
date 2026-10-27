import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { ResponsiveContainer } from "@shared/ui/ResponsiveContainer/ResponsiveContainer";
import { Input } from "@shared/ui/Input/Input";
import { Button } from "@shared/ui/Button/Button";
import { loginUserAPI } from "@shared/api/userApi";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

export const LoginScreen = ({ navigation }) => {
  const { isTablet } = useResponsiveLayout();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("@bipescola_token");
        if (token) {
          navigation.reset({ index: 0, routes: [{ name: "Main" }] });
        }
      } catch (e) {}
      setCheckingAuth(false);
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha email e senha.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUserAPI({ email, senha });

      await AsyncStorage.setItem("@bipescola_token", response.token);
      await AsyncStorage.setItem(
        "@bipescola_user",
        JSON.stringify(response.user)
      );

      navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    } catch (error) {
      Alert.alert("Erro no Login", error.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            isTablet && styles.contentTabletSplit,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Painel Institucional Esquerdo (Exclusivo para Tablets) */}
          {isTablet ? (
            <View style={styles.tabletHeroPanel}>
              <View style={styles.heroBadge}>
                <Feather name="shield" size={16} color={colors.textInverse} />
                <Text style={styles.heroBadgeText}>PORTAL INSTITUCIONAL</Text>
              </View>

              <Text style={styles.heroTitle}>
                Gestão Escolar & Chamada Inteligente
              </Text>
              <Text style={styles.heroSubtitle}>
                Segurança na portaria, controle de frequência em tempo real e
                comunicação direta entre escola e família.
              </Text>

              <View style={styles.heroFeaturesList}>
                <View style={styles.heroFeatureItem}>
                  <View style={styles.heroFeatureIcon}>
                    <Feather
                      name="maximize"
                      size={18}
                      color={colors.secondaryLight}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.heroFeatureTitle}>
                      Leitura QR Code na Portaria
                    </Text>
                    <Text style={styles.heroFeatureDesc}>
                      Validação rápida de entrada e saída para totens e tablets
                    </Text>
                  </View>
                </View>

                <View style={styles.heroFeatureItem}>
                  <View style={styles.heroFeatureIcon}>
                    <Feather
                      name="check-square"
                      size={18}
                      color={colors.secondaryLight}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.heroFeatureTitle}>
                      Diário de Classe 1-Toque
                    </Text>
                    <Text style={styles.heroFeatureDesc}>
                      Chamada escolar otimizada por turma para professores
                    </Text>
                  </View>
                </View>

                <View style={styles.heroFeatureItem}>
                  <View style={styles.heroFeatureIcon}>
                    <Feather
                      name="bell"
                      size={18}
                      color={colors.secondaryLight}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.heroFeatureTitle}>
                      Mural Oficial de Avisos
                    </Text>
                    <Text style={styles.heroFeatureDesc}>
                      Comunicados gerais e individuais para responsáveis
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../../assets/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Form Card */}
          <View style={[styles.formCard, isTablet && styles.formCardTablet]}>
            {isTablet && (
              <View style={styles.tabletLogoWrap}>
                <Image
                  source={require("../../../../assets/logo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            )}

            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Acesso ao BIP Escola</Text>
              <Text style={styles.subtitle}>
                Digite suas credenciais institucionais para continuar
              </Text>
            </View>

            <View style={styles.inputsContainer}>
              <Input
                label="E-mail"
                placeholder="seu.email@bipescola.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              <Input
                label="Senha de Acesso"
                placeholder="••••••••"
                isPassword
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => navigation.navigate("ResetPassword")}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <Button
                title="Entrar no Sistema"
                loading={loading}
                onPress={handleLogin}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  contentTabletSplit: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: spacing.xl,
    maxWidth: 1080,
    alignSelf: "center",
    width: "100%",
  },
  tabletHeroPanel: {
    flex: 1,
    maxWidth: 480,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl + 4,
    justifyContent: "center",
    ...shadows.card,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    gap: 6,
    marginBottom: spacing.md,
  },
  heroBadgeText: {
    fontSize: 11,
    fontFamily: "Roboto_700Bold",
    color: colors.textInverse,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: "Roboto_700Bold",
    color: colors.textInverse,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Roboto_400Regular",
    color: "rgba(255, 255, 255, 0.82)",
    marginBottom: spacing.xl,
  },
  heroFeaturesList: {
    gap: spacing.md,
  },
  heroFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  heroFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroFeatureTitle: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: colors.textInverse,
    marginBottom: 2,
  },
  heroFeatureDesc: {
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    color: "rgba(255, 255, 255, 0.75)",
  },
  logoContainer: {
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  tabletLogoWrap: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logoImage: {
    width: 210,
    height: 64,
  },
  formCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    ...shadows.card,
  },
  formCardTablet: {
    flex: 1,
    maxWidth: 460,
    borderRadius: radius.xl,
    padding: spacing.xl + 4,
  },
  headerTextContainer: {
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  inputsContainer: {
    width: "100%",
    marginBottom: spacing.xs,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
    minHeight: 24,
    justifyContent: "center",
  },
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    color: colors.primary,
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
  },
});
