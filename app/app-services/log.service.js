(function () {
    'use strict';

    angular
        .module('app')
        .factory('LogService', Service);

    function Service($window) {
        var service = {};

        service.Log = Log;

        initService();

        return service;

        function initService(){}

        function Log(message) {
			$window.console.log(message);
        }
    }
})();