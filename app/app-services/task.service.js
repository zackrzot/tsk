(function () {
    'use strict';

    angular
        .module('app')
        .factory('TaskService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetAll = GetAll;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
		service.GetUsersTasks = GetUsersTasks;

        return service;

        function GetAll() {
			console.log("angular.task.service: sending http get request.");
            return $http.get('/api/tasks');
        }
		
		function GetUsersTasks(_id) {
			return $http.get('/api/tasks/' + _id).then(handleSuccess, handleError);
		}

        function Create(task) {
            return $http.post('/api/tasks', task).then(handleSuccess, handleError);
        }

        function Update(task) {
            return $http.put('/api/tasks/' + task._id, task).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/tasks/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
