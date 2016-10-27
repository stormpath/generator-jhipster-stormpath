(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$rootScope', 'LoginService', '$state'];

    function HomeController ($scope, $rootScope, LoginService, $state) {
        var vm = this;

        vm.account = null;
        vm.login = LoginService.open;
        vm.register = register;

        // needed for page refresh
        if ($rootScope.user) {
            vm.account = $rootScope.user;
        }

        $scope.$on('$stateChangeUnauthorized', function () {
            $state.go('accessdenied');
        });

        $scope.$on('$currentUser', function($event, account) {
            vm.account = account;
        });

        function register () {
            $state.go('register');
        }
    }
})();
