(function() {
    'use strict';

    angular.module('<%=angularAppName%>')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('forgot-password', {
            parent: 'account',
            url: '/forgot-password',
            data: {
                authorities: [],
                pageTitle: 'forgot-password.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/account/forgot-password/forgot-password.html'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('reset');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
