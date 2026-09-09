import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PresenceMenuScreen } from "../ui/screens/PresenceMenuScreen";
import { QRCodeGeneratorScreen } from "../ui/screens/QRCodeGeneratorScreen";
import { QRCodeScannerScreen } from "../ui/screens/QRCodeScannerScreen";
import { ClassListScreen } from "../ui/screens/ClassListScreen";

const Stack = createNativeStackNavigator();

export function PresenceNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PresenceMenu" component={PresenceMenuScreen} />
      <Stack.Screen name="QRCodeGenerator" component={QRCodeGeneratorScreen} />
      <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} />
      <Stack.Screen name="ClassList" component={ClassListScreen} />
    </Stack.Navigator>
  );
}
