const { create } = require('../model/TaskModel');
const TaskModel = require('../model/TaskModel');
const {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth
} = require('date-fns');

const current = new Date();

class TaskController {

    async create(req, res) {
        const task = new TaskModel(req.body);
        await task
            .save()
            .then(response => {
                return res.status(201).json(response);
            }) // ok
            .catch(error => {
                return res.status(500).json(error);
            }) // erro
    }

    async update(req, res) {
        await TaskModel.findByIdAndUpdate({ '_id': req.params.id }, req.body, { new: true })
            .then(response => {
                return res.status(200).json(response); //ok
            }).catch(error => {
                return res.status(500).json(error); // error
            });
    }

    async all(req, res) {
        await TaskModel.find({ macaddress: { '$in': req.body.macaddress } })
            .sort('when') // organizando por data
            .then(response => {  // pegando a resposta
                return res.status(201).json(response)
            }).catch(error => {
                return req.status(500).json(error);
            })
    }

    async show(req, res) {
        await TaskModel.findById(req.params.id).then(response => {
            if (response) {
                return res.status(201).json(response);
            } else {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }
        }).catch(error => {
            return res.status(500).json(error);
        })
    }

    async delete(req, res) {
        await TaskModel.deleteOne({ '_id': req.params.id })
            .then(response => {
                return res.status(200).json(response);
            }).catch(error => {
                return res.status(500).json(error)
            })
    }

    async done(req, res) {
        await TaskModel.findByIdAndUpdate(
            { '_id': req.params.id },
            { 'done': req.params.done },
            { new: true } // retorna dados da tarefa atualizado
        ).then(response => {
            return res.status(200).json(response);
        }).catch(error => {
            return res.status(500).json(error)
        })
    }

    async late(req, res) {
        await TaskModel.find({
            'when': {
                '$lt': current //menor ou igual a data current
            },
            'macaddress': { '$in': req.body.macaddress } //
        }).sort('when') //organizado por data e por hora
            .then(response => {
                return res.status(200).json(response)
            }).catch(error => {
                return res.status(500).json(error)
            })
    }

    async today(req, res) {
        await TaskModel.find({
            'macaddress': { '$in': req.body.macaddress },
            'when': { '$gte': startOfDay(current), '$lt': endOfDay(current) }
        }).sort('when').then(response => {
            return res.status(200).json(response)
        }).catch(error => {
            return console.log(error)
        })
    }

    async week(req, res) {
        await TaskModel.find({
            'macaddress': { '$in': req.body.macaddress },
            'when': { '$gte': startOfWeek(current), '$lt': endOfWeek(current) }
        }).sort('when').then(response => {
            return res.status(200).json(response)
        }).catch(error => {
            return console.log(error)
        })
    }

    async month(req, res) {
        await TaskModel.find({
            'macaddress': { '$in': req.body.macaddress },
            'when': { '$gte': startOfMonth(current), '$lt': endOfMonth(current) }
        }).sort('when').then(response => {
            return res.status(200).json(response)
        }).catch(error => {
            return console.log(error)
        })
    }


}


module.exports = new TaskController();