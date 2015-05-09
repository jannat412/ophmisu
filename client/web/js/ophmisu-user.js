var userApp = angular.module('ophmisu.user', ['ui.router']);

userApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'index.php?view=home',
          controller: ['$scope', '$state', function ($scope, $state) {
            }]
        })
      .state('profile', {
          url: '/profile',
          templateUrl: 'index.php?view=profile',
          controller: ['$scope', '$state', function ($scope, $state) {
          }]
      })
      .state('ranks', {
          url: '/ranks',
          templateUrl: 'index.php?view=ranks',
          controller: ['$scope', '$state', function ($scope, $state, userService) {
          }]
      })
      ;
    }
  ]
);


userApp.controller('UserController', function ($scope, $state, $location, userService) {
    $scope.form = {
        username: "",
        password: "",
        email: ""
    };

    $scope.user = userService.getUser();
    $scope.errors = [];
    $scope.messages = [];

    if ($state.$current.name == 'ranks') {
        $scope.ranks = userService.getRanks(function(data, status, headers, config) {
            $scope.ranks = data.ranks;
        });
    }


    $scope.register = function() {
        userService.register( $scope.form )
            .then(function(response) {
                $scope.messages = [];
                $scope.errors = [];
                if (response.messages)
                {
                    $scope.user = response.user;
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
                    $scope.user = response.user;
                    setTimeout(function() {
                        $state.go('game');
                    }, 500);
                }
                else if (response.errors)
                {
                    $scope.errors = response.errors;
                    $scope.user = null;
                }
            }, function( errorMessage ) {
                console.warn( errorMessage );
            }
        );
    };

    $scope.update = function() {
        userService.getUser().nickname = "xx";
        console.log(userService.getUser());
    };
});

userApp.service(
    "userService",
    function( $http, $q ) {
        this.user = null;

        return({
            getRanks: getRanks,
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

        function getRanks(successCallback) {
            return request('ranks', {}, successCallback);
        }

        function request(action, data, successCallback) {
            var request = $http({
                method: "post",
                url: "index.php",
                params: {
                    action: action
                },
                data: {
                    form: data
                }
            }).success(successCallback);

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