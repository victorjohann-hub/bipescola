import * as classModel from '../models/classModel.js';

export async function createClass ({ nome }) {
    const turma = await classModel.createClass({
        nome
    });

    return {
        turma
    };
}
export async function getClasses () {
    return await classModel.getClasses();
}

export async function getClassById (id){
    return await classModel.findById(id);
}

export async function deleteClassById(id) {
    const studentCount = await classModel.countStudentsByTurmaId(id);
    if (studentCount > 0) {
        const error = new Error(`Não é possível excluir uma turma com alunos vinculados (${studentCount} aluno(s))`);
        error.statusCode = 400;
        throw error;
    }
    return await classModel.deleteById(id);
}

export async function updateClassById(id, data) {
    return await classModel.updateClassById(id, data);
}