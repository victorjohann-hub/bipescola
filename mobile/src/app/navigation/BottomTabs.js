import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RegisterScreen } from "@pages/Register";

import { PresenceNavigator } from "@pages/Presence";
import { ProfileScreen } from "@pages/Profile";

// Placeholder screens for other tabs
const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{name}</Text>
  </View>
);
const HomeScreen = () => <PlaceholderScreen name="Home (Notificações)" />;
const EvaluationScreen = () => <PlaceholderScreen name="Avaliação" />;

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Feather
                name="bell"
                size={24}
                color={focused ? "#000" : "#000"}
              />
              <Text style={styles.iconText}>nome</Text>
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
        component={EvaluationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
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
    height: 80,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: 10,
    paddingTop: 10,
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
