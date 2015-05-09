/**
 * Ophmisu Trivia (https://github.com/wsergio/ophmisu)
 *
 * @package     Ophmisu
 * @author      Sergiu Valentin VLAD <sergiu@disruptive.academy>
 * @copyright   Copyright (c) 2012-2015 Sergiu Valentin VLAD
 * @license     http://opensource.org/licenses/MIT  The MIT License (MIT)
 * @link        https://github.com/wsergio/ophmisu
 */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
var ophmisu = angular.module('ophmisu', [
    'btford.socket-io',
    'ophmisu.user',
    'ophmisu.game',
    'ui.bootstrap',
    'ui.router',
    'ngAnimate']);

ophmisu.factory('socket', function (socketFactory) {
    var opts = {};
    opts.port = config.app.httpPort;
    opts['force new connection'] = true;
    opts['reconnection delay'] = 1000;
    opts['reconnection limit'] = 1000;
    opts['max reconnection attempts'] = 'Infinity';
    if (window.location.protocol == 'https:')
    {
        opts.port = config.app.httpsPort;
        opts.secure = true;
    }

    return socketFactory({
        //prefix: 'foo~',
        ioSocket: io.connect(window.location.protocol+'//' + config.app.hostname + ':'+opts.port, opts)
    });
});

ophmisu.run(
    [ '$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    console.log('$stateChangeStart from ', fromState, toState);
                    //console.log(unfoundState.to); // "lazy.state"
                    //console.log(unfoundState.toParams); // {a:1, b:2}
                    //console.log(unfoundState.options); // {inherit:false} + default options
                });
        }
    ]
);

ophmisu.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/');

    }
]);

ophmisu.controller('AppController', function ($scope, $location, userService) {
    $scope.user = null;
    $scope.users = [];
    $scope.totalUsers = 0;
    $scope.maxTopUsers = 5;
    $scope.rooms = [];

    $scope.reset = function() {
        $scope.user = null;
        $scope.users = [];
        $scope.rooms = [];
    };

    $scope.disconnect = function() {
        //$scope.$broadcast('disconnect');
        //$scope.reset();
        window.location.assign('/');
    };


    $scope.$on('updateUsers', function(event, items) {
        console.log('AppController: updateUsers!');
        $scope.users = items;

        var size = 0;
        for (var i in items) {
            size++;
        }
        $scope.totalUsers = size;
        $scope.$digest();
    });

    $scope.$on('updateRooms', function(event, items) {
        console.log('AppController: updateRooms!');
        $scope.rooms = items;
        $scope.$digest();
    });


});