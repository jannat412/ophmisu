var game = angular.module('ophmisu.game', ['ophmisu.engine', 'ophmisu.translator', 'ui.router', 'ngSanitize'])

game.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $stateProvider
            .state("game", {
                url: "/game",
                templateUrl: 'index.php?view=game',
                //controller: 'GameController',
              //controller: ['$scope', '$state', function (  $scope,   $state) {
              //    console.log('game state ctrl');
                  //$scope.disconnect();
              //}]
            })
            //.state('connect', {
            //    url: '/connect',
                //template: 'Connecting..',
                //templateUrl: 'index.php?view=connect',
                //controller: 'GameController',
                //controllerAs: 'game'
            //})
          //.state('disconnect', {
          //    url: '/disconnect'
              //controller: ['$scope', '$state', function (  $scope,   $state) {
              //    $scope.disconnect();
              //}]
              //template: 'Connecting..',
              //templateUrl: 'index.php?view=connect',
              //controller: 'GameController'
              //controllerAs: 'game'
          //})
      ;
    }
  ]
);

game.filter('pad', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = ''+num;
        while (num.length < len) {
            num = '0'+num;
        }
        return num;
    };
})

game.controller('GameController', function ($scope, $state, $location, $sce, $filter, translator, socket, userService) {
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

    $scope.reset = function () {
        $scope.notifications = [];
        $scope.messages = [];
        $scope.currentMessage = '';

        $scope.users = [];
        $scope.userCount = 0;
        $scope.rooms = [];
        $scope.currentRoom = null;

        $scope.$emit('updateRooms', []);
        $scope.$emit('updateUsers', []);
    };

    $scope.talk = function() {
        console.log('talk');
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
        var date = new Date(),
            hh = $filter('pad')(date.getHours(), 2),
            mm = $filter('pad')(date.getMinutes(), 2),
            ss = $filter('pad')(date.getSeconds(), 2)
            ;

        obj.time =  hh + ':' + mm + ':' + ss;
        console.log('Scope in message()', $scope);
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
        console.log('onConnect', arguments);
        $state.go('game');
    };

    $scope.connect = function() {
        console.log("connect");
        socket.connect();
        console.log(socket);
        //socket.connect(null,{'forceNew':true});
    };
    $scope.disconnect = function() {
        console.log('$scope disconnect', arguments);
        //socket.disconnect();
    };

    $scope.$on('disconnect', function() {
        console.log('$scope.$on(disconnect)', arguments);
        socket.disconnect();
        //$scope.disconnect();
        //$scope.reset();
    });

    this.initSocket = function (socket) {
        console.log('Initializing socket');
        socket.on('connect', function () {
            console.log('on connect');
            $scope.authenticate();
        });
        socket.on('disconnect', function (){
            console.log('disconnected');
            $scope.systemMessage('Disconnected');
            setTimeout(function() {
                $state.go('home');
            }, 1000);
        });
        socket.on('error', function (err) {
            if (err.description) throw err.description;
            else throw err; // Or whatever you want to do


            $scope.systemMessage(e);
        });

        socket.on('update_rooms', function (rooms) {
            console.log('update_rooms', arguments);
            $scope.$emit('updateRooms', rooms);
            $scope.users = rooms;
        });

        socket.on('nicknames', function (users) {
            console.log('nicknames', arguments);

            $scope.$emit('updateUsers', users);
            $scope.users = users;
        });

        socket.on('announcement', function (a,b,c,d,e) {
            console.log('announcement', arguments);
            $scope.systemMessage.apply(this, arguments);
        });

        socket.on('user message', function(who, text) {
            console.log('user message', who, text);
            $scope.message(who, text);
        });

    };

    if (!socket.initialized) {
        this.initSocket(socket);
        socket.initialized = 1;
    }


    //if (socket.connected) {
    //    socket.connect();
    //}
});


