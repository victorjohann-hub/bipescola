import { Platform } from 'react-native';

// Atualizado para usar o IP da máquina, o que resolve o erro de "Network Error" em celulares físicos e emuladores.
const BASE_URL = 'http://192.168.1.2:3000/api';

export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
