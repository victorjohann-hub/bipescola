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
    const turmas = await classModel.getClasses();

    return {
        turmas
    };
}

export async function getClassById (id){
    const turma = await classModel.findById(id);

    return {
        turma
    };
}

export async function deleteClassById(id) {
    return await classModel.deleteById(id);
}