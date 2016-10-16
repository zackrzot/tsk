var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('tasks');

var service = {};

service.getById = getById;
service.create = create;
service.getUsersTasks = getUsersTasks;
service.update = update;
service.getAllTasks = getAllTasks;
service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.tasks.findById(_id, function (err, task) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (task) {
            // return task (without hashed password)
            deferred.resolve(_);
        } else {
            // task not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAllTasks() {
	console.log("express.task.service: getting all tasks from db.");
    var deferred = Q.defer();
	
    db.tasks.find(function (err, tasks) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (tasks) {
            console.log("express.task.service: YES");
			deferred.resolve(tasks);
        } else {
            console.log("express.task.service: NO");
            deferred.resolve();
        }
    });
	
    return deferred.promise;
}

function getUsersTasks(_id) {
	console.log("express.task.service: getting a user "+_id+" tasks from db.");
    var deferred = Q.defer();
	
    db.tasks.find(
	{ "taskowner": _id },
	function (err, tasks) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (tasks) {
            console.log("express.task.service: YES");
			deferred.resolve(tasks.toArray());
        } else {
            console.log("express.task.service: NO");
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(taskParam) {
    var deferred = Q.defer();

	db.tasks.insert(
		taskParam,
		function (err, doc) {
			if (err) deferred.reject(err.name + ': ' + err.message);
			deferred.resolve();
		});

    return deferred.promise;
}

function update(_id, taskParam) {
    var deferred = Q.defer();

    // validation
    db.tasks.findById(_id, function (err, task) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (task.taskname !== taskParam.taskname) {
            // taskname has changed so check if the new taskname is already taken
            db.tasks.findOne(
                { taskname: taskParam.taskname },
                function (err, task) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (task) {
                        // task name already exists
                        deferred.reject('Task name "' + req.body.taskname + '" is already in use.')
                    } else {
                        updateTask();
                    }
                });
        } else {
            updateTask();
        }
    });

    function updateTask() {
        // fields to update
        var set = {
            taskName: taskParam.taskname,
			taskOwner: taskParam.taskowner,
            taskDesc: taskParam.taskdesc,
            taskCreatedOn: taskParam.taskcreatedon,
			taskActive: taskParam.taskactive,
			taskCompleted: taskParam.taskcompleted,
			taskDeleted: taskParam.taskdeleted,
        };

        db.tasks.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.tasks.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}