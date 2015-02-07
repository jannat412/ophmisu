/**
 * Ophmisu Trivia (https://github.com/wsergio/ophmisu)
 *
 * @package     Ophmisu
 * @author      Sergiu Valentin VLAD <sergiu@disruptive.academy>
 * @copyright   Copyright (c) 2012-2015 Sergiu Valentin VLAD
 * @license     http://opensource.org/licenses/MIT  The MIT License (MIT)
 * @link        https://github.com/wsergio/ophmisu
 */

var ophmisuApp = angular.module('ophmisuApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate']);

ophmisuApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/game', {
                templateUrl: 'index.php?view=game',
                controller: 'GameController',
                controllerAs: 'game'
            })
            .when('/', {
                templateUrl: 'index.php?view=home',
                controller: 'GameController',
                controllerAs: 'game'
            })
            .when('/Book/:bookId/ch/:chapterId', {
                templateUrl: 'chapter.html',
                controller: 'ChapterCtrl',
                controllerAs: 'chapter'
            }).otherwise({
                //template: function(args) { return $('#default-page').html(); },
                //templateUrl: 'index.php?view=home',
                controller: function ($scope) {
                    //$scope.message = 'Welcome!!';
                }
            });

        //$locationProvider.html5Mode(true);
    }
]);

ophmisuApp.controller('MainCtrl', ['$route', '$routeParams', '$location',
    function($route, $routeParams, $location) {
        this.$route = $route;
        this.$location = $location;
        this.$routeParams = $routeParams;
    }]);


ophmisuApp.controller('UserController', function ($scope, $location, userService) {
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
                    $location.path('/game');
                }
                else if (response.errors)
                {
                    $scope.errors = response.errors;
                    console.log(response.errors);

                }
            }, function( errorMessage ) {
                console.warn( errorMessage );
            }
        );
    };
});

// I act a repository for the remote friend collection.
ophmisuApp.service(
    "userService",
    function( $http, $q ) {
        return({
            register: register,
            login: login
        });

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

        function handleError( response ) {
            if (!angular.isObject( response.data ) || !response.data.message) {
                return( $q.reject( "An unknown error occurred." ) );
            }

            return( $q.reject( response.data.message ) );
        }
        function handleSuccess( response ) {
            return( response.data );
        }

    }
);




ophmisuApp.controller('GameController', function ($scope, $location, userService) {
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
                    console.log($location,1);
                    $location.path('xxx.html');
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