import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export function getBaseUrl(env = process.env, constants = Constants) {
  if (env && env.EXPO_PUBLIC_API_URL) {
    return env.EXPO_PUBLIC_API_URL;
  }

  // Detecta o IP do host dinamicamente ao rodar via Expo Go na mesma rede
  const hostUri = constants?.expoConfig?.hostUri || constants?.manifest2?.extra?.expoClient?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000/api`;
  }

  // Emuladores e simulação local
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }

  return 'http://localhost:3000/api';
}

const BASE_URL = getBaseUrl();

export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  let token = null;
  try {
    token = await AsyncStorage.getItem('@bipescola_token');
    if (token) {
      token = token.replace(/^"|"$/g, '');
    }
  } catch (e) {
    console.error('Failed to get token', e);
  }
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };

  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Ocorreu um erro na requisição');
  }

  return data;
};
