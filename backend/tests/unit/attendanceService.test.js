import { jest } from '@jest/globals';

const mockAttendanceModel = {
  createAttendance: jest.fn(),
  findByStudentId: jest.fn(),
  findByDate: jest.fn(),
  findById: jest.fn(),
  updateAttendance: jest.fn(),
  deleteAttendance: jest.fn(),
  findByFilters: jest.fn(),
};

jest.unstable_mockModule('../../src/models/attendanceModel.js', () => mockAttendanceModel);

const attendanceService = await import('../../src/services/attendanceService.js');

describe('attendanceService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('markAttendance deve delegar para attendanceModel.createAttendance', async () => {
    mockAttendanceModel.createAttendance.mockResolvedValueOnce({ id: 1, presente: 1 });
    const res = await attendanceService.markAttendance({ aluno_id: 1, data: '2026-10-27', presente: true });
    expect(res).toEqual({ id: 1, presente: 1 });
    expect(mockAttendanceModel.createAttendance).toHaveBeenCalledTimes(1);
  });

  it('getAttendanceByStudent deve delegar para findByStudentId', async () => {
    mockAttendanceModel.findByStudentId.mockResolvedValueOnce([{ id: 1 }]);
    const res = await attendanceService.getAttendanceByStudent(5);
    expect(res).toEqual([{ id: 1 }]);
    expect(mockAttendanceModel.findByStudentId).toHaveBeenCalledWith(5);
  });

  it('getAttendanceByDate deve delegar para findByDate', async () => {
    mockAttendanceModel.findByDate.mockResolvedValueOnce([{ id: 2 }]);
    const res = await attendanceService.getAttendanceByDate('2026-10-27');
    expect(res).toEqual([{ id: 2 }]);
    expect(mockAttendanceModel.findByDate).toHaveBeenCalledWith('2026-10-27');
  });

  it('getAttendanceById deve delegar para findById', async () => {
    mockAttendanceModel.findById.mockResolvedValueOnce({ id: 3 });
    const res = await attendanceService.getAttendanceById(3);
    expect(res).toEqual({ id: 3 });
    expect(mockAttendanceModel.findById).toHaveBeenCalledWith(3);
  });

  it('updateAttendance deve delegar para updateAttendance', async () => {
    mockAttendanceModel.updateAttendance.mockResolvedValueOnce({ id: 4, presente: 0 });
    const res = await attendanceService.updateAttendance(4, { data: '2026-10-27', presente: false });
    expect(res).toEqual({ id: 4, presente: 0 });
    expect(mockAttendanceModel.updateAttendance).toHaveBeenCalledWith(4, { data: '2026-10-27', presente: false });
  });

  it('deleteAttendance deve delegar para deleteAttendance', async () => {
    mockAttendanceModel.deleteAttendance.mockResolvedValueOnce(true);
    const res = await attendanceService.deleteAttendance(4);
    expect(res).toBe(true);
    expect(mockAttendanceModel.deleteAttendance).toHaveBeenCalledWith(4);
  });

  describe('getAttendanceHistory', () => {
    it('deve retornar métricas zeradas quando não houver registros', async () => {
      mockAttendanceModel.findByFilters.mockResolvedValueOnce([]);

      const result = await attendanceService.getAttendanceHistory({});

      expect(result).toEqual({
        resumo: {
          totalRegistros: 0,
          totalPresentes: 0,
          totalFaltas: 0,
          taxaComparecimento: '0%',
        },
        registros: [],
      });
    });

    it('deve calcular corretamente a taxa e métricas de presenças e faltas', async () => {
      mockAttendanceModel.findByFilters.mockResolvedValueOnce([
        { id: 1, presente: 1 },
        { id: 2, presente: true },
        { id: 3, presente: 0 },
        { id: 4, presente: false },
      ]);

      const result = await attendanceService.getAttendanceHistory({ data_inicio: '2026-10-01' });

      expect(result.resumo).toEqual({
        totalRegistros: 4,
        totalPresentes: 2,
        totalFaltas: 2,
        taxaComparecimento: '50%',
      });
      expect(result.registros).toHaveLength(4);
    });
  });
});
