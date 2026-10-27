import * as classService from '../services/classService.js';

export async function createClass(req, res) {
    try {
        const { nome } = req.body ?? {};

        if (!nome) {
            return res.status(400).json({
                error: 'nome da turma é obrigatório'
            });
        }
        
        const result = await classService.createClass({
            nome
        });

        return res.status(201).json({
            message: 'Turma criada',
            data: {
                id: result.turma.id,
                nome: result.turma.nome
            },
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

export async function getClasses(req, res) {
    try {
        const turmas = await classService.getClasses();
        return res.status(200).json({
            message: 'Lista de Turmas: ',
            data: turmas
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

export async function getClassById(req, res) {
    try {
        const classId = Number(req.params.id);
        if (!Number.isInteger(classId)) {
            return res.status(400).json({ error: 'ID da turma inválido' });
        }

        const turma = await classService.getClassById(classId);
        
        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada!' });
        }
    
        return res.status(200).json({
            message: 'Turma',
            data: turma
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

export async function deleteClassById(req, res) {
    try {
        const classId = Number(req.params.id);
        if (!Number.isInteger(classId)) {
            return res.status(400).json({ error: 'ID da turma inválido' });
        }

        const turma = await classService.deleteClassById(classId);

        if (!turma) {
            return res.status(404).json({
                message: "Turma não encontrada"
            });
        }

        return res.status(200).json({
            message: 'Turma deletada',
            data: turma
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao deletar turma',
            error: error.message
        });
    }
}

export async function updateClassById(req, res) {
    try {
        const classId = Number(req.params.id);
        if (!Number.isInteger(classId)) {
            return res.status(400).json({ error: 'ID da turma inválido' });
        }

        const { nome, status } = req.body ?? {};
        const turma = await classService.updateClassById(classId, { nome, status });

        if (!turma) {
            return res.status(404).json({
                message: "Turma não encontrada"
            });
        }

        return res.status(200).json({
            message: 'Turma atualizada com sucesso',
            data: turma
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar turma',
            error: error.message
        });
    }
}
