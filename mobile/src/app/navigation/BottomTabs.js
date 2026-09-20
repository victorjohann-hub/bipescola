import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RegisterScreen } from "@pages/Register";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PresenceNavigator } from "@pages/Presence";
import { ProfileScreen } from "@pages/Profile";
import { NoticesNavigator } from "@pages/Notices";
import { EvaluationNavigator } from "@pages/Evaluation";

// Placeholder screens for other tabs
const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{name}</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar, 
          { 
            // Adiciona o inset da navegação do sistema para não sobrepor os ícones
            height: 70 + insets.bottom,
            paddingBottom: 10 + insets.bottom,
            // Mantém a tab bar alinhada com o conteúdo restrito no tablet
            alignSelf: 'center',
            width: '100%',
            maxWidth: isTablet ? (width > 900 ? 750 : '85%') : '100%',
            borderTopWidth: 0, // Remove a borda original para ficar mais clean se for card
            elevation: 0, // Remove sombra no android para evitar linha dupla
          }
        ],
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Avisos"
        component={NoticesNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: "#FFCDD2" }, // Rosa claro
              ]}
            >
              <Feather
                name="bell"
                size={24}
                color={focused ? "#000" : "#000"}
              />
              <Text style={styles.iconText}>Avisos</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Presence"
        component={PresenceNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: "#C5E1A5" },
              ]}
            >
              <Feather
                name="check-circle"
                size={24}
                color={focused ? "#000" : "#000"}
              />
              <Text style={styles.iconText}>Presença</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: "#C1B4D8" },
              ]}
            >
              <Feather
                name="plus-square"
                size={24}
                color={focused ? "#000" : "#000"}
              />
              <Text style={styles.iconText}>Cadastrar</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Evaluation"
        component={EvaluationNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: "#FDE68A" }, // Amarelo
              ]}
            >
              <Feather
                name="clipboard"
                size={24}
                color={focused ? "#000" : "#000"}
              />
              <Text style={styles.iconText}>Avaliação</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: "#A0C4E1" },
              ]}
            >
              <Feather
                name="user"
                size={24}
                color={focused ? "#000" : "#000"}
              />
              <Text style={styles.iconText}>Perfil</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    paddingTop: 10,
    // Adiciona sombra suave no tablet para combinar com o ResponsiveContainer
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  activeIconContainer: {
    backgroundColor: "#C1B4D8", // Light purple background when selected
  },
  iconText: {
    fontSize: 10,
    fontFamily: "Roboto_500Medium",
    color: "#000",
    marginTop: 4,
  },
});
