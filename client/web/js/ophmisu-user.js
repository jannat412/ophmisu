var userApp = angular.module('ophmisu.user', ['ui.router']);

userApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'index.php?view=home',
          controller: ['$scope', '$state', function (  $scope,   $state) {
            }]
        });
    }
  ]
);


userApp.controller('UserController', function ($scope, $location, userService) {
    $scope.form = {
        username: "",
        password: "",
        email: ""
    };
    $scope.user = null;
    $scope.errors = [];
    $scope.messages = [];

    $scope.register = function() {
        userService.register( $scope.form )
            .then(function(response) {
                $scope.messages = [];
                $scope.errors = [];
                if (response.messages)
                {
                    $scope.user = user;
                    $scope.messages = response.messages;
                }
                else if (response.errors)
                {
                    $scope.user = null;
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
                    userService.setUser(response.user);
                    $location.path('/connect');
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

userApp.service(
    "userService",
    function( $http, $q ) {
        this.user = null;

        return({
            register: register,
            login: login,
            setUser: setUser,
            getUser: getUser
        });

        function setUser(user) {
            this.user = user;
        }

        function getUser(user) {
            return this.user;
        }
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