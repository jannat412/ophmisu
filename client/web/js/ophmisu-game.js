var game = angular.module('ophmisu.game', ['ophmisu.engine', 'ophmisu.translator', 'ui.router'])
  
game.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $stateProvider
            .state("game", {
                url: "/game",
                templateUrl: 'index.php?view=game',
                //controller: 'GameController'
            })
            .state('connect', {
                url: '/connect',
                //template: 'Connecting..',
                templateUrl: 'index.php?view=connect',
                //controller: 'GameController',
                //controllerAs: 'game'
            });
    }
  ]
);

game.controller('GameController', function ($scope, $state, $location, $sce, translator, socket, userService) {
    $scope.user = userService.getUser();
    $scope.nickname = 'Anonim-' + Math.round(Math.random() * 1000);
    if ($scope.user) {
        $scope.nickname = $scope.user.nickname || $scope.nickname;
    }
    $scope.notifications = [];
    $scope.messages = [];
    $scope.currentMessage = '';

    $scope.users = [];
    $scope.userCount = 0;
    $scope.rooms = [];
    $scope.currentRoom = null;

    $scope.talk = function() {
        socket.emit('user message', $scope.currentMessage);
        $scope.currentMessage = '';
    }
    $scope.message = function(who, text) {
        var obj = {};
        if (typeof(text) == 'object') {
            obj = text;
        } else {
            obj.text = text;
        }

        obj.html = $sce.trustAsHtml(obj.text);
        if (who) {
            obj.sender = who;
        }
        var date = new Date();
        obj.time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        $scope.messages.push(obj);
        $('html, body').scrollTop(100000)
    };
    $scope.systemMessage = function() {
        console.log('systemMessage', arguments);
        var text = 'Unknown message';
        if (arguments.length == 1) {
            text = arguments[0];
        } else {
            text = translator.translate.apply(this, arguments);
        }
        $scope.message(null, text);
    };


    socket.on('connect', function () {
        console.log('on connect');
        $scope.authenticate();
    });
    socket.on('disconnect', function (){
        console.log('disconnected');
        $scope.systemMessage('Disconnected');
    });
    socket.on('error', function (e) {
        console.log(e);
        if (!e) e = "System panic attack!";
        $scope.systemMessage(e);
    });


    $scope.authenticate = function() {
        console.log('connecting as ' + $scope.nickname);
        socket.emit('nickname', {
            nickname: $scope.nickname
        }, function(error) {
            if (!error) {
                $scope.systemMessage('Connected as ' + $scope.nickname);
                $scope.onConnect();
            } else {
                $scope.systemMessage('Connection failed');
            }
        });
    };
    $scope.onConnect = function() {
        $state.go('game');
    };

    socket.on('update_rooms', function (rooms) {
        $scope.$emit('updateRooms', rooms);
        $scope.users = rooms;
    });

    socket.on('nicknames', function (users) {
        $scope.$emit('updateUsers', users);
        $scope.users = users;
    });

    socket.on('announcement', function (a,b,c,d,e) {
        $scope.systemMessage.apply(this, arguments);
    });

    socket.on('user message', function(who, text) {
        $scope.message(who, text);
    });

});