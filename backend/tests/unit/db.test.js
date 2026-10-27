import { jest } from '@jest/globals';

const mockRelease = jest.fn();
const mockExecute = jest.fn();
const mockGetConnection = jest.fn();

const mockPool = {
  getConnection: mockGetConnection,
};

jest.unstable_mockModule('mysql2/promise', () => ({
  default: {
    createPool: jest.fn(() => mockPool),
  },
}));

const { query, getConnection } = await import('../../src/database/db.js');

describe('db.js Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve executar a query e liberar a conexão', async () => {
    mockExecute.mockResolvedValueOnce([[{ id: 1 }], []]);
    mockGetConnection.mockResolvedValueOnce({
      execute: mockExecute,
      release: mockRelease,
    });

    const results = await query('SELECT 1', []);
    expect(results).toEqual([{ id: 1 }]);
    expect(mockGetConnection).toHaveBeenCalledTimes(1);
    expect(mockExecute).toHaveBeenCalledWith('SELECT 1', []);
    expect(mockRelease).toHaveBeenCalledTimes(1);
  });

  it('deve liberar a conexão mesmo em caso de erro na query', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockExecute.mockRejectedValueOnce(new Error('Syntax error'));
    mockGetConnection.mockResolvedValueOnce({
      execute: mockExecute,
      release: mockRelease,
    });

    await expect(query('SELECT ERROR', [])).rejects.toThrow('Syntax error');
    expect(mockRelease).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });

  it('getConnection deve delegar para pool.getConnection', async () => {
    mockGetConnection.mockResolvedValueOnce({ dummy: true });
    const conn = await getConnection();
    expect(conn).toEqual({ dummy: true });
  });
});
