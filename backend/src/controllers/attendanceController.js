import * as attendanceService from "../services/attendanceService.js";

export async function createAttendance(req, res) {
  try {
    const { aluno_id, data, presente } = req.body ?? {};

    if (!aluno_id || !data || presente === undefined) {
      return res.status(400).json({
        error: "aluno_id, data e presente são obrigatórios"
      });
    }

    if (!req.user) {
      return res.status(401).json({
        error: "Usuário não autenticado"
      });
    }

    const attendance = await attendanceService.markAttendance({
      aluno_id,
      data,
      presente,
      registrado_por: req.user.id
    });

    return res.status(201).json({
      message: "Presença registrada com sucesso",
      data: attendance
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "A presença desse aluno já foi registrada nessa data"
      });
    }

    return res.status(500).json({
      error: "Erro ao registrar presença"
    });
  }
}

export async function listAttendanceByStudent(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "ID do aluno inválido"
      });
    }

    const attendance = await attendanceService.getAttendanceByStudent(id);

    return res.status(200).json(attendance);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar presença do aluno"
    });
  }
}

export async function listAttendanceByDate(req, res) {
  try {
    const { data } = req.params;

    const attendance = await attendanceService.getAttendanceByDate(data);

    return res.status(200).json(attendance);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar presenças da data"
    });
  }
}

export async function getAttendance(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "ID da presença inválido"
      });
    }

    const attendance = await attendanceService.getAttendanceById(id);

    if (!attendance) {
      return res.status(404).json({
        error: "Registro de presença não encontrado"
      });
    }

    return res.status(200).json(attendance);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar presença"
    });
  }
}

export async function updateAttendance(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "ID da presença inválido"
      });
    }

    const { data, presente } = req.body ?? {};

    if (!data || presente === undefined) {
      return res.status(400).json({
        error: "data e presente são obrigatórios"
      });
    }

    const attendance = await attendanceService.updateAttendance(id, {
      data,
      presente
    });

    if (!attendance) {
      return res.status(404).json({
        error: "Registro de presença não encontrado"
      });
    }

    return res.status(200).json({
      message: "Presença atualizada com sucesso",
      data: attendance
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao atualizar presença"
    });
  }
}

export async function deleteAttendance(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "ID da presença inválido"
      });
    }

    const deleted = await attendanceService.deleteAttendance(id);

    if (!deleted) {
      return res.status(404).json({
        error: "Registro de presença não encontrado"
      });
    }

    return res.status(200).json({
      message: "Presença excluída com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao excluir presença"
    });
  }
}

export async function getAttendanceHistory(req, res) {
  try {
    const { data, data_inicio, data_fim, aluno_id, turma_id, presente } = req.query;

    const result = await attendanceService.getAttendanceHistory({
      data,
      data_inicio,
      data_fim,
      aluno_id,
      turma_id,
      presente
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar histórico de presenças"
    });
  }
}
