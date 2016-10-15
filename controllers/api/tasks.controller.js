var express = require('express');
var router = express.Router();
var taskService = require('services/task.service');

// routes
router.post('/', createTask);
router.get('/', getAllTasks);
router.put('/:_id', updateTask);
router.delete('/:_id', deleteTask);


module.exports = router;

function createTask(req, res) {
    taskService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTasks(req, res) {
    taskService.getAllTasks(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTask(req, res) {
    var taskId = req.task.sub;
	
    //if (req.params._id !== taskId) {
    //    // can only update own task
    //    return res.status(401).send('You can only update your own task');
    //}

    taskService.update(taskId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteTask(req, res) {
    var taskId = req.task.sub;
    //if (req.params._id !== taskId) {
    //    // can only delete own task
        return res.status(401).send('You can only delete your own task');
    //}

    taskervice.delete(taskId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}