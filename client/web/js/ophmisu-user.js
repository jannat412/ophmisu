var userApp = angular.module('ophmisu.user', [
  'ui.router'
])

userApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        //////////////
        // Contacts //
        //////////////
        .state('home', {
          url: '/',
          templateUrl: 'index.php?view=home',
          controller: ['$scope', '$state', function (  $scope,   $state) {

            }]
        })
    }
  ]
);


userApp.controller('UserController', function ($scope, $location, userService) {
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
userApp.service(
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