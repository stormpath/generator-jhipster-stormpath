(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('login', {
            parent: 'app',
            url: '/login',
            data: {
                pageTitle: 'login.title'
            },
            onEnter: ['LoginService', function(LoginService) {
                LoginService.open();
            }]
        });
    }
})();
