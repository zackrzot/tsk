(function () {
    'use strict';

    angular
        .module('app')
        .controller('Tasks.IndexController', Controller);

    function Controller(UserService, TaskService) {
        var vm = this;

        vm.user = null;
		vm.tasks = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
			
			// get users tasks
			TaskService.GetAll().then(function (tasks) {
				vm.tasks = tasks;
			});
			
			
			
			
			
        }
		
		
		
		
		
		
		
		
		
		
    }

})();
