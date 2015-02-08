var game = angular.module('ophmisu.game', ['ophmisu.engine', 'ui.router'])
  
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

game.controller('GameController', function ($scope, $state, $location, userService) {
    var self = this;

    self.socket = null;
    self.$scope = $scope;

    $scope.user = userService.getUser();
    $scope.connectRequested = $scope.connectRequested || false;
    $scope.nickname = 'Leya';
    console.log('User: ', $scope.user);
    if ($scope.user) {
        $scope.nickname = $scope.user.nickname || $scope.nickname;

    }
    $scope.errors = [];
    $scope.messages = [];
    $scope.xxx = ['INIX'];

    $scope.users = [];
    $scope.userCount = 0;
    $scope.rooms = [];
    $scope.currentRoom = null;

    $scope.message = function(text) {
        $scope.xxx.push(text);
        //$scope.$digest();
        $scope.$apply()
        //console.log('Pused', text);
        console.log('Pused ' + text + ' to $scope ', self.$scope.$id, $scope);
    };

    $scope.$on('message', function(event, message) {
        console.log('GameController: received message event', message);
        $scope.message(message)
    });


    $scope.debug = function() {
        console.log('Debug: ', $scope.xxx);
        $scope.message('OKA!');
    };

    $scope.connect = function() {
        console.log(userService.getUser());
        console.log('connecting');
        $scope.initSocket(self.socket);
    };

    $scope.initSocket = function(socket) {
        try {
            var opts = {};
            opts.port = config.app.httpPort;
            opts['force new connection'] = true;
            if (window.location.protocol == 'https:')
            {
                opts.port = config.app.httpsPort;
                opts.secure = true;
            }
            try
            {
                console.log('Connecting to ', window.location.protocol+'//' + config.app.hostname + ':'+opts.port);
                socket = io.connect(window.location.protocol+'//' + config.app.hostname + ':'+opts.port, opts);
            } catch (e) {
                console.log('Socket IO failed', e);
            }
        }
        catch (e)
        {
            console.log('Exception', e);
        }
        socket.on('connect', function () {
            console.log('on connect');
            var nickname = $scope.nickname;

            var default_room = '';
            if (requestParams.room) {
                default_room = requestParams.room;
            }
            var emit_data = {nickname: nickname, default_room: default_room};
            if (typeof(udata) != 'undefined' )
            {
                emit_data.fb_user_id = udata.fb_user_id;
                emit_data.fb_access_token = udata.fb_access_token;
            }
            socket.emit('nickname', emit_data, function (nicknameInUse)
            {
                // all okay, proceed to game state
                if (!nicknameInUse) {
                    $scope.initCommunication(this);
                    $state.go('game');
                    $scope.$emit('message', 'Connected');
                }
                else {
                    $scope.errors = ["You are already connected"];
                    $scope.$digest();

                    //$state.go('home');
                    //disconnect();
                }
            });
        });

        socket.on('error', function (e) {
            console.log('on error', e);
            if (!e || typeof(e) == "object") e = "Panic attack! Wtf just happened?!";
            $scope.message('System', e);
        });

        socket.on('disconnect', function (){
            console.log('disconnected');
            socket.destroy();
            // maybeAutoreconnect();

        });
        socket.on('reconnect_failed', function () {
            console.log('reconnect_failed');
        });

        socket.on('connect_failed', function (a,b,c) {
            console.log('connect_failed');
        });
    };






    $scope.initCommunication = function(socket) {
        socket.on('update_rooms', function(rooms, current_room) {
            console.log('on update_rooms', rooms, current_room);
            $scope.$emit('updateRooms', rooms);
        });

        socket.on('announcement', function (msg,a,b,c,d) {
            console.log('on announcement', arguments);
            $scope.message('SHiT!');
            $('#lines').append($('<p>').append($('<em>').text(msg)));
            scrollDown();
        });

        socket.on('top', function (users) {
            if (!users) return;
            for (var i = 0; i < users.length; i++)
            {
                var user = users[i];
                var b = $('.'+user.nickname);
                if (b && b.length > 0) b.find('.score').html(user.score);
            }
        });
        socket.on('nicknames', function (nicknames) {
            console.log('on nicknames', nicknames);
            $scope.$emit('updateUsers', nicknames);
            $scope.users = nicknames;
            $scope.userCount = 0;
            for (var i in nicknames) {
                $scope.userCount++;
            }
            $scope.$digest();
        });

        socket.on('user message', $scope.message);

        socket.on('reconnect', function () {
            console.log('on reconnect');
            $('#lines').html("");
            $scope.message('System', 'Reconnected to the server');
        });


    };




    if ($scope.connectRequested) {
        $scope.connect();
    }

});