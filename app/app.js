﻿(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/all");

        $stateProvider
            .state('tasks', {
                url: '/all',
                templateUrl: 'tasks/index.html',
                controller: 'Tasks.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'tasks' }
            })
			.state('all', {
                url: '/all',
                templateUrl: 'tasks/index.html',
                controller: 'Tasks.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'tasks' }
            })
			.state('active', {
                url: '/active',
                templateUrl: 'tasks/active.html',
                controller: 'Tasks.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'tasks' }
            })
			.state('inactive', {
                url: '/inactive',
                templateUrl: 'tasks/inactive.html',
                controller: 'Tasks.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'tasks' }
            })
			.state('completed', {
                url: '/completed',
                templateUrl: 'tasks/completed.html',
                controller: 'Tasks.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'tasks' }
            })
			.state('deleted', {
                url: '/deleted',
                templateUrl: 'tasks/index.html',
                controller: 'Tasks.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'tasks' }
            })
			.state('create', {
                url: '/create',
                templateUrl: 'create/index.html',
                controller: 'Create.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'create' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();