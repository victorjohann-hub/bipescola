import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EvaluationListScreen } from '../ui/screens/EvaluationListScreen';
import { EvaluationCreateScreen } from '../ui/screens/EvaluationCreateScreen';

const Stack = createNativeStackNavigator();

export const EvaluationNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EvaluationList" component={EvaluationListScreen} />
      <Stack.Screen name="EvaluationCreate" component={EvaluationCreateScreen} />
    </Stack.Navigator>
  );
};
