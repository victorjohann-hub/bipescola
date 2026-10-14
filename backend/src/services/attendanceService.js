import * as attendanceModel from "../models/attendanceModel.js";

export async function markAttendance(data) {
  return await attendanceModel.createAttendance(data);
}

export async function getAttendanceByStudent(aluno_id) {
  return await attendanceModel.findByStudentId(aluno_id);
}

export async function getAttendanceByDate(data) {
  return await attendanceModel.findByDate(data);
}

export async function getAttendanceById(id) {
  return await attendanceModel.findById(id);
}

export async function updateAttendance(id, data) {
  return await attendanceModel.updateAttendance(id, data);
}

export async function deleteAttendance(id) {
  return await attendanceModel.deleteAttendance(id);
}

export async function getAttendanceHistory(filters) {
  const records = await attendanceModel.findByFilters(filters);

  const totalRegistros = records.length;
  const totalPresentes = records.filter(r => r.presente === 1 || r.presente === true).length;
  const totalFaltas = totalRegistros - totalPresentes;
  const taxaComparecimento = totalRegistros > 0
    ? `${Math.round((totalPresentes / totalRegistros) * 100)}%`
    : '0%';

  return {
    resumo: {
      totalRegistros,
      totalPresentes,
      totalFaltas,
      taxaComparecimento
    },
    registros: records
  };
}