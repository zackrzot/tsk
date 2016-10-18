(function () {
    'use strict';

    angular
        .module('app')
        .controller('Create.IndexController', Controller);

    function Controller($window, UserService, FlashService, TaskService) {
        var vm = this;

        vm.user = null;
		
        var task = {
            taskname: null,
			taskowner: null,
            taskdesc: null,
            taskcreatedon: null,
			taskactive: true,
			taskcompleted: null,
			taskdeleted: null
        };
		
		vm.task = task;
		
		vm.createTask = createTask;
		vm.clearInputs = clearInputs;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
				vm.task.taskowner = vm.user._id;
            });
        }
		
		function createTask(){
			
			if(vm.task.taskname  == "" || vm.task.taskname  == null)
			{
				FlashService.Error("Task title must not be empty.");
				return;
			}
			
			// vm.task.taskname in HTML
			// vm.task.taskdesc in HTML
			vm.task.taskcreatedon = new Date().toString();
			// vm.task.taskactive in HTML
			vm.task.taskcompleted = false;
			vm.task.taskdeleted = false;
			
			TaskService.Create(vm.task);

			FlashService.Success("Task created!");
			
			clearInputs();
		}
		
		function clearInputs(){
			
			$window.document.getElementById('tasknameinput').value = "";
			$window.document.getElementById('taskdescinput').value = "";
			$window.document.getElementById('taskactiveinput').value = true;
			
		}
		
		
		
		
    }

})();
