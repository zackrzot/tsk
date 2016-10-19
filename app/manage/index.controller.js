(function () {
    'use strict';

    angular
        .module('app')
        .controller('Manage.IndexController', Controller);

    function Controller($scope, $window, UserService, TaskService, FlashService) {
        var vm = this;

        vm.user = null;
		vm.tasks = null;
		
        initController();
		
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
				
				// get users tasks
				TaskService.GetUsersTasks(vm.user._id).then(function (tasks) {
					vm.tasks = tasks;
					
				});
            });
        }



	}
})();
