import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Atualizado para o IP atual da máquina na rede local (192.168.1.50:3000)
const BASE_URL = 'http://192.168.1.50:3000/api';

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
