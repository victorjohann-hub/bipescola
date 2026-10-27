import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, radius, shadows, spacing, typography } from "@shared/theme";
import { useResponsiveLayout } from "@shared/hooks/useResponsiveLayout";

import { PresenceNavigator } from "@pages/Presence";
import { ProfileScreen } from "@pages/Profile";
import { NoticesNavigator } from "@pages/Notices";
import { AdminNavigator } from "@pages/Admin";
import { AttendanceHistoryScreen } from "@pages/AttendanceHistory";

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  Avisos: {
    icon: "bell",
    shortLabel: "Avisos",
    fullLabel: "Mural de Avisos",
    activeColor: colors.notice,
    activeBg: colors.noticeSurface,
  },
  Presence: {
    icon: "check-circle",
    shortLabel: "Presença",
    fullLabel: "Controle de Presença",
    activeColor: colors.secondary,
    activeBg: colors.secondarySurface,
  },
  Frequência: {
    icon: "calendar",
    shortLabel: "Frequência",
    fullLabel: "Histórico & Frequência",
    activeColor: colors.primary,
    activeBg: colors.primarySurface,
  },
  Admin: {
    icon: "briefcase",
    shortLabel: "Painel ADM",
    fullLabel: "Gestão Escolar",
    activeColor: colors.highlight,
    activeBg: colors.highlightSurface,
  },
  Profile: {
    icon: "user",
    shortLabel: "Perfil",
    fullLabel: "Meu Perfil",
    activeColor: colors.primary,
    activeBg: colors.primarySurface,
  },
};

const ROLE_LABELS = {
  ADM: "Administrador",
  PROF: "Professor(a)",
  PORTEIRO: "Portaria",
  PARENT: "Responsável",
};

function AdaptiveTabBar({ state, descriptors, navigation, userInfo }) {
  const insets = useSafeAreaInsets();
  const { isTablet, isLargeTablet } = useResponsiveLayout();

  const handlePress = (route, isFocused) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  if (isTablet) {
    return (
      <View
        style={[
          styles.sidebar,
          isLargeTablet ? styles.sidebarExpanded : styles.sidebarRail,
          {
            paddingTop: Math.max(insets.top, spacing.lg),
            paddingBottom: Math.max(insets.bottom, spacing.lg),
            paddingLeft: Math.max(insets.left, spacing.sm),
          },
        ]}
      >
        {/* Brand Header */}
        <View
          style={[
            styles.brandSection,
            !isLargeTablet && styles.brandSectionCompact,
          ]}
        >
          <View style={styles.brandLogoCircle}>
            <Feather name="shield" size={22} color={colors.textInverse} />
          </View>
          {isLargeTablet && (
            <View style={styles.brandTextWrap}>
              <Text style={styles.brandTitle}>BIP Escola</Text>
              <Text style={styles.brandSubtitle}>
                {ROLE_LABELS[userInfo?.role] || "Portal Escolar"}
              </Text>
            </View>
          )}
        </View>

        {/* Navigation Items */}
        <View style={styles.railItemsContainer}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const cfg = TAB_CONFIG[route.name] || TAB_CONFIG.Profile;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                activeOpacity={0.75}
                onPress={() => handlePress(route, isFocused)}
                style={[
                  styles.railItem,
                  isLargeTablet ? styles.railItemExpanded : styles.railItemCompact,
                  isFocused && { backgroundColor: cfg.activeBg },
                ]}
              >
                {isFocused && (
                  <View
                    style={[
                      styles.activeIndicator,
                      { backgroundColor: cfg.activeColor },
                    ]}
                  />
                )}
                <Feather
                  name={cfg.icon}
                  size={22}
                  color={isFocused ? cfg.activeColor : colors.textSecondary}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    isLargeTablet ? styles.railLabelExpanded : styles.railLabelCompact,
                    isFocused && {
                      color: cfg.activeColor,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {isLargeTablet ? cfg.fullLabel : cfg.shortLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer User Card in Expanded Tablet Landscape */}
        {isLargeTablet && userInfo?.nome && (
          <TouchableOpacity
            style={styles.sidebarFooter}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={styles.footerAvatar}>
              <Text style={styles.footerAvatarText}>
                {userInfo.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.footerUserName} numberOfLines={1}>
                {userInfo.nome}
              </Text>
              <Text style={styles.footerUserEmail} numberOfLines={1}>
                {userInfo.email || ROLE_LABELS[userInfo.role]}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Smartphone Bottom Bar (< 768px)
  return (
    <View
      style={[
        styles.bottomBar,
        {
          height: 68 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const cfg = TAB_CONFIG[route.name] || TAB_CONFIG.Profile;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            activeOpacity={0.75}
            onPress={() => handlePress(route, isFocused)}
            style={styles.bottomTabButton}
          >
            <View
              style={[
                styles.iconContainer,
                isFocused && { backgroundColor: cfg.activeBg },
              ]}
            >
              <Feather
                name={cfg.icon}
                size={20}
                color={isFocused ? cfg.activeColor : colors.textMuted}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.iconText,
                  isFocused && { color: cfg.activeColor, fontWeight: "700" },
                ]}
              >
                {cfg.shortLabel}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function BottomTabs() {
  const { isTablet } = useResponsiveLayout();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("@bipescola_user");
        if (userStr) {
          setUserInfo(JSON.parse(userStr));
        }
      } catch (e) {
        console.error("Erro ao buscar usuário:", e);
      }
    };
    loadUser();
  }, []);

  const role = userInfo?.role;

  if (!role) {
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

  const canSeeNotices = ["ADM", "PROF", "PARENT"].includes(role);
  const canSeeAdmin = ["ADM"].includes(role);
  const canSeePresence = ["ADM", "PROF", "PARENT", "PORTEIRO"].includes(role);
  const canSeeAttendanceHistory = ["ADM", "PROF", "PORTEIRO"].includes(role);

  return (
    <Tab.Navigator
      tabBar={(props) => <AdaptiveTabBar {...props} userInfo={userInfo} />}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isTablet ? "left" : "bottom",
      }}
    >
      {canSeeNotices && <Tab.Screen name="Avisos" component={NoticesNavigator} />}
      {canSeePresence && (
        <Tab.Screen name="Presence" component={PresenceNavigator} />
      )}
      {canSeeAttendanceHistory && (
        <Tab.Screen name="Frequência" component={AttendanceHistoryScreen} />
      )}
      {canSeeAdmin && <Tab.Screen name="Admin" component={AdminNavigator} />}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // Smartphone Bottom Bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.surface,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.card,
  },
  bottomTabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    height: 48,
    minWidth: 64,
    borderRadius: radius.md,
  },
  iconText: {
    fontSize: 11,
    fontFamily: "Roboto_500Medium",
    color: colors.textMuted,
    marginTop: 2,
  },

  // Tablet Sidebar / Navigation Rail
  sidebar: {
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    justifyContent: "space-between",
    paddingRight: spacing.sm,
    ...shadows.subtle,
  },
  sidebarRail: {
    width: 96,
    alignItems: "center",
  },
  sidebarExpanded: {
    width: 248,
  },
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.sm,
  },
  brandSectionCompact: {
    justifyContent: "center",
    paddingHorizontal: 0,
    width: "100%",
  },
  brandLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTextWrap: {
    flex: 1,
  },
  brandTitle: {
    ...typography.h3,
    color: colors.primary,
    lineHeight: 20,
  },
  brandSubtitle: {
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
    color: colors.textMuted,
    marginTop: 2,
  },
  railItemsContainer: {
    flex: 1,
    width: "100%",
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  railItem: {
    position: "relative",
    borderRadius: radius.md,
    overflow: "hidden",
  },
  railItemCompact: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    minHeight: 64,
  },
  railItemExpanded: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    gap: spacing.md,
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 10,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  railLabelCompact: {
    fontSize: 11,
    fontFamily: "Roboto_500Medium",
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  railLabelExpanded: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    flex: 1,
  },
  sidebarFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm + 4,
    marginHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  footerAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  footerAvatarText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: "700",
  },
  footerUserName: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    color: colors.textPrimary,
  },
  footerUserEmail: {
    fontSize: 11,
    fontFamily: "Roboto_400Regular",
    color: colors.textMuted,
  },
});
