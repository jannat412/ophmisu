/**
 * Ophmisu Trivia (https://github.com/wsergio/ophmisu)
 *
 * @package     Ophmisu
 * @author      Sergiu Valentin VLAD <sergiu@disruptive.academy>
 * @copyright   Copyright (c) 2012-2015 Sergiu Valentin VLAD
 * @license     http://opensource.org/licenses/MIT  The MIT License (MIT)
 * @link        https://github.com/wsergio/ophmisu
 */

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
    $scope.rooms = [];

    $scope.$on('updateUsers', function(event, items) {
        console.log('AppController: updateUsers!');
        $scope.users = items;
        $scope.$digest();
    });

    $scope.$on('updateRooms', function(event, items) {
        console.log('AppController: updateRooms!');
        $scope.rooms = items;
        $scope.$digest();
    });


});