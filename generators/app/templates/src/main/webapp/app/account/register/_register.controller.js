(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('RegisterController', RegisterController);


    RegisterController.$inject = ['$timeout'];

    function RegisterController ($timeout) {
        var vm = this;

        $timeout(function (){angular.element('#sp-givenName').focus();}, 200);
    }
})();
