import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NoticeListScreen } from '../ui/screens/NoticeListScreen';
import { NoticeCreateScreen } from '../ui/screens/NoticeCreateScreen';

const Stack = createNativeStackNavigator();

export const NoticesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NoticeList" component={NoticeListScreen} />
      <Stack.Screen name="NoticeCreate" component={NoticeCreateScreen} />
    </Stack.Navigator>
  );
};
