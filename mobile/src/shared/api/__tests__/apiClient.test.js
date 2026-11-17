import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { apiClient, getBaseUrl } from '../apiClient';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: null,
    manifest2: null,
  },
}));

// Mock global fetch
global.fetch = jest.fn();

describe('apiClient and getBaseUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBaseUrl', () => {
    it('deve usar EXPO_PUBLIC_API_URL quando definido', () => {
      const env = { EXPO_PUBLIC_API_URL: 'https://meu-servidor.com/api' };
      expect(getBaseUrl(env)).toBe('https://meu-servidor.com/api');
    });

    it('deve usar o IP do hostUri de expoConfig quando disponível', () => {
      const constants = { expoConfig: { hostUri: '192.168.15.10:8081' } };
      expect(getBaseUrl({}, constants)).toBe('http://192.168.15.10:3000/api');
    });

    it('deve usar o IP do hostUri de manifest2 extra expoClient quando disponível', () => {
      const constants = {
        manifest2: { extra: { expoClient: { hostUri: '192.168.1.99:19000' } } },
      };
      expect(getBaseUrl({}, constants)).toBe('http://192.168.1.99:3000/api');
    });

    it('deve retornar 10.0.2.2 no Android se não houver hostUri', () => {
      const originalOS = Platform.OS;
      Platform.OS = 'android';
      expect(getBaseUrl({}, {})).toBe('http://10.0.2.2:3000/api');
      Platform.OS = originalOS;
    });

    it('deve retornar localhost em outras plataformas', () => {
      const originalOS = Platform.OS;
      Platform.OS = 'ios';
      expect(getBaseUrl({}, {})).toBe('http://localhost:3000/api');
      Platform.OS = originalOS;
    });
  });

  describe('apiClient requests', () => {
    it('deve injetar token com Bearer e remover aspas', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('"fake-jwt-token"');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [1, 2] }),
      });

      const res = await apiClient('/users/me');

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@bipescola_token');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-jwt-token',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(res).toEqual({ success: true, data: [1, 2] });
    });

    it('deve serializar body se for objeto', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 10 }),
      });

      const payload = { nome: 'Aluno 1', faltas: 0 };
      await apiClient('/students', {
        method: 'POST',
        body: payload,
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/students'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload),
        })
      );
    });

    it('deve lançar erro com data.error ou data.message quando response.ok for falso', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Acesso negado: você não tem permissão' }),
      });

      await expect(apiClient('/restricted')).rejects.toThrow(
        'Acesso negado: você não tem permissão'
      );
    });

    it('deve usar mensagem de erro fallback caso nem error nem message existam', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(apiClient('/restricted')).rejects.toThrow(
        'Ocorreu um erro na requisição'
      );
    });
  });
});
