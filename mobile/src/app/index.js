import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, LondrinaSolid_300Light, LondrinaSolid_900Black } from '@expo-google-fonts/londrina-solid';
import { Roboto_300Light, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Inter_300Light } from '@expo-google-fonts/inter';
import { AppNavigator } from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function App() {
  let [fontsLoaded] = useFonts({
    LondrinaSolid_300Light,
    LondrinaSolid_900Black,
    Roboto_300Light,
    Roboto_500Medium,
    Roboto_700Bold,
    Inter_300Light,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5A9BD6" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
