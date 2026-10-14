import * as classService from '../services/classService.js';

export async function createClass(req, res) {
    try{
        const { nome } = req.body;

        if(!nome) {
            return res.status(400).json({
                error: 'nome da turma é obrigatório'
            })
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
        })
    }catch(error) {
        return res.status(400).json({
            error: error.message
        });
    }
}