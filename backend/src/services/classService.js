import * as classModel from '../models/classModel.js';

export async function createClass ({ nome }) {
    const turma = await classModel.createClass({
        nome
    });

    return {
        turma
    };
}