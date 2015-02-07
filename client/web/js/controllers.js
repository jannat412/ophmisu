/**
 * Ophmisu Trivia (https://github.com/wsergio/ophmisu)
 *
 * @package     Ophmisu
 * @author      Sergiu Valentin VLAD <sergiu@disruptive.academy>
 * @copyright   Copyright (c) 2012-2015 Sergiu Valentin VLAD
 * @license     http://opensource.org/licenses/MIT  The MIT License (MIT)
 * @link        https://github.com/wsergio/ophmisu
 */

var ophmisuApp = angular.module('ophmisuApp', ['ui.bootstrap']);

ophmisuApp.controller('UserController', function ($scope, userService) {
    $scope.phones = [
        {'name': 'Nexus S',
            'snippet': 'Fast just got faster with Nexus S.'},
        {'name': 'Motorola XOOM™ with Wi-Fi',
            'snippet': 'The Next, Next Generation tablet.'},
        {'name': 'MOTOROLA XOOM™',
            'snippet': 'The Next, Next Generation tablet.'}
    ];
    $scope.name = "World";

    $scope.form = {
        username: "",
        password: "",
        email: ""
    };
    $scope.errors = [];
    $scope.messages = [];

    $scope.register = function() {
        userService.register( $scope.form )
            .then(function(response) {
                $scope.messages = [];
                $scope.errors = [];
                if (response.messages)
                {
                    $scope.messages = response.messages;
                }
                else if (response.errors)
                {
                    $scope.errors = response.errors;
                }
            }, function( errorMessage ) {
                console.warn( errorMessage );
            }
        );
    };

    $scope.login = function() {
        userService.login( $scope.form )
            .then(function(response) {
                $scope.messages = [];
                $scope.errors = [];
                if (response.messages)
                {
                    $scope.messages = response.messages;
                }
                else if (response.errors)
                {
                    $scope.errors = response.errors;
                }
            }, function( errorMessage ) {
                console.warn( errorMessage );
            }
        );
    };

});

ophmisuApp.controller('CollapseDemoCtrl', function ($scope) {
    $scope.isCollapsed = true;
});

ophmisuApp.controller('TabsDemoCtrl', function ($scope, $window) {
    $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

    $scope.alertMe = function() {
        setTimeout(function() {
            $window.alert('You\'ve selected the alert tab!');
        });
    };
});

// I act a repository for the remote friend collection.
ophmisuApp.service(
    "userService",
    function( $http, $q ) {

        // Return public API.
        return({
            register: register,
            login: login
        });


        // ---
        // PUBLIC METHODS.
        // ---


        function register(data) {
            var request = $http({
                method: "post",
                url: "index.php",
                params: {
                    action: "register"
                },
                data: {
                    form: data
                }
            });

            return( request.then( handleSuccess, handleError ) );
        }

        function login(data) {
            var request = $http({
                method: "post",
                url: "index.php",
                params: {
                    action: "login"
                },
                data: {
                    form: data
                }
            });

            return( request.then( handleSuccess, handleError ) );
        }


        // ---
        // PRIVATE METHODS.
        // ---


        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError( response ) {

            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
            ) {

                return( $q.reject( "An unknown error occurred." ) );

            }

            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );

        }


        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {

            return( response.data );

        }

    }
);