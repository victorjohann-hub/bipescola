import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export function getBaseUrl(
  env = process.env,
  constants = Constants,
  win = typeof window !== 'undefined' ? window : undefined
) {
  if (env && env.EXPO_PUBLIC_API_URL) {
    return env.EXPO_PUBLIC_API_URL;
  }

  // No navegador Web (celular ou desktop), resolve dinamicamente pelo endereço atual da página
  if (Platform.OS === 'web' && win && win.location && win.location.hostname) {
    const { protocol, hostname, port, origin } = win.location;
    // Quando aberto via Expo Web Dev Server (porta 8081 ou 19006), aponta para a porta 3000 do mesmo IP/host
    if (port === '8081' || port === '19006') {
      return `${protocol}//${hostname}:3000/api`;
    }
    // Quando servido de forma unificada pelo Backend (porta 3000) ou via túnel HTTPS (Cloudflare / Ngrok)
    if (origin && origin !== 'null') {
      return `${origin}/api`;
    }
    return `${protocol}//${hostname}:3000/api`;
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

export const apiClient = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
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
