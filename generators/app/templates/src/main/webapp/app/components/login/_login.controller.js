(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', '$scope', '$timeout', 'Principal', '$uibModalInstance'];

    function LoginController ($state, $scope, $timeout, Principal, $uibModalInstance) {
        var vm = this;

        vm.cancel = cancel;

        function cancel () {
            vm.credentials = {
                username: null,
                password: null,
                rememberMe: true
            };
            vm.authenticationError = false;
            $uibModalInstance.dismiss('cancel');
        }

        $timeout(function (){angular.element('#sp-login').focus();}, 200);

        $scope.$on('$authenticated', function(event, data) {
            Principal.identity(data);
            vm.authenticationError = false;
            $uibModalInstance.close();
            if ($state.current.name === 'register' || $state.current.name === 'activate' ||
                $state.current.name === 'finishReset' || $state.current.name === 'requestReset') {
                $state.go('home');
            }
        });

        $scope.$on('$authenticationFailure', function() {
            vm.authenticationError = true;
            console.log('Stormpath authentication failed! :(');
        });

        function register () {
            $uibModalInstance.dismiss('cancel');
            $state.go('register');
        }

        vm.forgotPassword = forgotPassword;

        function forgotPassword() {
            $uibModalInstance.dismiss('cancel');
            $state.go('forgot-password');
        }
    }
})();
