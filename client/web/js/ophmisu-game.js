var game = angular.module('ophmisu.game', ['ophmisu.engine', 'ui.router'])
  
game.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $stateProvider
            .state("game", {
                url: "/game",
                templateUrl: 'index.php?view=game'
            })
            .state('connect', {
                url: '/connect',
                //template: 'Connecting..',
                templateUrl: 'index.php?view=connect',
                controller: 'GameController',
                controllerAs: 'game'
            });
    }
  ]
);

game.controller('GameController', function ($scope, $state, $location, userService) {
    var self = this;

    self.socket = null;

    $scope.user = userService.getUser();
    $scope.connectRequested = $scope.connectRequested || false;
    $scope.nickname = 'Leya';
    if ($scope.user) {
        $scope.nickname = $scope.user.nickname || $scope.nickname;

    }
    $scope.errors = [];
    $scope.messages = [];

    $scope.users = [];
    $scope.userCount = 0;
    $scope.rooms = [];
    $scope.currentRoom = null;

    $scope.$on('updateRooms', function(rooms) {
        $scope.rooms = rooms;
    });


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
            console.log(e);
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
                }
                else {
                    $scope.errors = ["You are already connected"];
                    $scope.$digest();

                    //$state.go('home');
                    //disconnect();
                }
            });
        });

        socket.on('error', function (e)
        {
            console.log('on error', e);
            if (!e || typeof(e) == "object") e = "Panic attack! Wtf just happened?!";
            message('System', e);
        });

        socket.on('disconnect', function (){
            console.log('disconnected');
            socket.destroy();
            maybeAutoreconnect();

        });
        socket.on('reconnect_failed', function () {
            console.log(a,b,c);
        });

        socket.on('connect_failed', function (a,b,c) {
            console.log(a,b,c);
        });
    };






    $scope.initCommunication = function(socket) {
        socket.on('update_rooms', function(rooms, current_room) {
            console.log('on update_rooms', rooms, current_room);

            //$scope.$digest();
            $scope.$apply(function() {
                console.log(rooms, current_room);
                //$scope.rooms = rooms;
                //$scope.currentRoom = current_room;
                $scope.$broadcast('updateRooms', rooms);

            });
        });

        socket.on('announcement', function (msg) {
            console.log('on announcement', msg);
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
            $scope.users = nicknames;
            $scope.userCount = 0;
            for (var i in nicknames) {
                $scope.userCount++;
            }
            $scope.$digest();
        });

        socket.on('user message', message);

        socket.on('reconnect', function () {
            console.log('on reconnect');
            $('#lines').html("");
            message('System', 'Reconnected to the server');
        });


    };


    if ($scope.connectRequested) {
        $scope.connect();
    }

});





var lines = 0;
function message(from, msg)
{
    msg = msg.replace(/</g, '&lt;');
    msg = msg.replace(/>/g, '&gt;');
    msg = $("<div/>").html(msg).text();

    msg = msg.replace(/\n/g, '<br />');
    msg = $('<p>').append('<span class="time">'+(new Date().format("isoTime"))+'</span>', $('<span class="user ophmisu">').text(from), msg);
    if (++lines > MAX_LINES)
        $('#lines p:first').remove();
    $('#lines').append(msg);
    if ($('#lines').length > 0)
        scrollDown();
}