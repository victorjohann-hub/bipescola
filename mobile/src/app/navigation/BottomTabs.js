import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, shadows, spacing } from "@shared/theme";

import { PresenceNavigator } from "@pages/Presence";
import { ProfileScreen } from "@pages/Profile";
import { NoticesNavigator } from "@pages/Notices";
import { AdminNavigator } from "@pages/Admin";
import { AttendanceHistoryScreen } from "@pages/AttendanceHistory";

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const userStr = await AsyncStorage.getItem('@bipescola_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setRole(user.role);
        }
      } catch (e) {
        console.error('Erro ao buscar role:', e);
      }
    };
    loadRole();
  }, []);

  if (!role) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Regras de negócio de visibilidade
  const canSeeNotices = ['ADM', 'PROF', 'PARENT'].includes(role);
  const canSeeAdmin = ['ADM'].includes(role);
  const canSeePresence = ['ADM', 'PROF', 'PARENT', 'PORTEIRO'].includes(role);
  const canSeeAttendanceHistory = ['ADM', 'PROF', 'PORTEIRO'].includes(role);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar, 
          { 
            height: 64 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8),
            alignSelf: 'center',
            width: '100%',
            maxWidth: isTablet ? (width > 900 ? 760 : '88%') : '100%',
          }
        ],
        tabBarShowLabel: false,
      }}
    >
      {canSeeNotices && (
        <Tab.Screen
          name="Avisos"
          component={NoticesNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && { backgroundColor: colors.noticeSurface }]}>
                <Feather name="bell" size={22} color={focused ? colors.notice : colors.textMuted} />
                <Text style={[styles.iconText, focused && { color: colors.notice, fontWeight: '700' }]}>Avisos</Text>
              </View>
            ),
          }}
        />
      )}

      {canSeePresence && (
        <Tab.Screen
          name="Presence"
          component={PresenceNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && { backgroundColor: colors.secondarySurface }]}>
                <Feather name="check-circle" size={22} color={focused ? colors.secondary : colors.textMuted} />
                <Text style={[styles.iconText, focused && { color: colors.secondary, fontWeight: '700' }]}>Presença</Text>
              </View>
            ),
          }}
        />
      )}

      {canSeeAttendanceHistory && (
        <Tab.Screen
          name="Frequência"
          component={AttendanceHistoryScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && { backgroundColor: colors.primarySurface }]}>
                <Feather name="calendar" size={22} color={focused ? colors.primary : colors.textMuted} />
                <Text style={[styles.iconText, focused && { color: colors.primary, fontWeight: '700' }]}>Frequência</Text>
              </View>
            ),
          }}
        />
      )}

      {canSeeAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && { backgroundColor: colors.highlightSurface }]}>
                <Feather name="briefcase" size={22} color={focused ? colors.highlight : colors.textMuted} />
                <Text style={[styles.iconText, focused && { color: colors.highlight, fontWeight: '700' }]}>Painel ADM</Text>
              </View>
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primarySurface }]}>
              <Feather name="user" size={22} color={focused ? colors.primary : colors.textMuted} />
              <Text style={[styles.iconText, focused && { color: colors.primary, fontWeight: '700' }]}>Perfil</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.card,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 48,
    borderRadius: radius.md,
  },
  iconText: {
    fontSize: 11,
    fontFamily: "Roboto_500Medium",
    color: colors.textMuted,
    marginTop: 2,
  },
});
