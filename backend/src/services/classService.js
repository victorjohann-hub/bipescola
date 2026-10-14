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
    return await classModel.deleteById(id);
}

export async function updateClassById(id, data) {
    return await classModel.updateClassById(id, data);
}