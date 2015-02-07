var game = angular.module('ophmisu.game', ['ophmisu.engine', 'ui.router'])
  
game.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $stateProvider
            .state("game", {
                url: "/game",
                templateUrl: 'index.php?view=game'
            });
    }
  ]
);

game.controller('GameController', function ($scope, $location, userService) {
    $scope.form = {
        username: "",
        password: "",
        email: ""
    };
    $scope.errors = [];
    $scope.messages = [];

});