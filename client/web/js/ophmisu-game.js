var game = angular.module('ophmisu.game', ['ophmisu.engine', 'ophmisu.translator', 'ui.router', 'ngSanitize'])

game.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state("game", {
                url: "/game",
                templateUrl: 'index.php?view=game'
            });
    }]
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

game.controller('GameController', function ($scope, $state, $location, gameService) {
    console.log('GameController scope #' + $scope.$id);
    gameService.setScope($scope);
    gameService.initialize();
    $scope.gameService = gameService;

});

game.service(
    "gameService",
    function( userService, socket, $sce, $filter, $state, translator ) {
        self = this;
        this.scope = {};

        /**
         * Expose methods & data
         */
        return({
            data: self,
            initialize: initialize,
            reset: reset,
            setScope: setScope
        });

        /**
         * @TODO: move data into a model
         */
        function reset() {
            self.nickname = 'Anonim-' + Math.round(Math.random() * 1000);
            self.notifications = [];
            self.messages = [];
            self.currentMessage = '';


            self.users = [];
            self.userCount = 0;
            self.rooms = [];
            self.currentRoom = null;

            self.scope.$emit('updateRooms', []);
            self.scope.$emit('updateUsers', []);
        }

        function initialize() {
            console.log('initialize scope #' + self.scope.$id);

            self.nickname = self.nickname || 'Anonim-' + Math.round(Math.random() * 1000);
            self.notifications = self.notifications || [];
            self.messages = self.messages || [];
            self.currentMessage = '';

            self.users = self.users || [];
            self.userCount = self.userCount || 0;
            self.rooms = self.rooms || [];
            self.currentRoom = self.currentRoom || null;

            self.user = userService.getUser();
            if (self.user) {
                self.nickname = self.user.nickname || self.nickname;
            }

            initializeScope();

            if (!socket.initialized) {
                initSocket(socket);
                socket.initialized = 1;
            } else {
            }
        }

        function initializeScope() {
            self.scope.$on('disconnect', function() {
                console.log('$scope.$on(disconnect)', arguments);
                socket.disconnect();
                //$scope.disconnect();
                //$scope.reset();
            });

            self.scope.talk = function() {
                socket.emit('user message', self.currentMessage);
                self.currentMessage = '';
            }
        }

        function setScope(scope) {
            self.scope = scope;
        }


        /**
         * Internal methods
         */
        function message(who, text) {
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

            obj.time = hh + ':' + mm + ':' + ss;
            if (self.messages.length > 5000) {
                self.messages = [];
            }
            self.messages.push(obj);

            var contentZone = $('.op-content-zone');
            if (contentZone && contentZone.length == 1) {
                contentZone.animate({scrollTop: contentZone.get(0).scrollHeight}, 200);
            }
        };

        function systemMessage() {
            console.log('systemMessage', arguments);
            var text = 'Unknown message';
            if (arguments.length == 1) {
                text = arguments[0];
            } else {
                text = translator.translate.apply(self, arguments);
            }
            message(null, text);
        };

        function authenticate() {
            console.log('connecting as ' + self.nickname);
            socket.emit('nickname', {
                nickname: self.nickname
            }, function(error) {
                if (!error) {
                    systemMessage('Connected as ' + self.nickname);
                    onConnect();
                } else {
                    systemMessage('Connection failed');
                }
            });
        };



        function onConnect() {
            console.log('onConnect', arguments);
            $state.go('game');
        };

        function connect() {
            console.log("connect");
            socket.connect();
            //socket.connect(null,{'forceNew':true});
        };
        function disconnect() {
            console.log('$scope disconnect', arguments);
            //socket.disconnect();
        };

        /***
         * Socket related stuff
         * @param socket
         */

        function initSocket(socket) {
            console.log('Initializing socket');
            socket.on('connect', function () {
                console.log('on connect');
                authenticate();
            });
            socket.on('disconnect', function (){
                console.log('disconnected');
                systemMessage('Disconnected');
                setTimeout(function() {
                    $state.go('home');
                }, 1000);
            });
            socket.on('error', function (err) {
                if (err.description) throw err.description;
                else throw err; // Or whatever you want to do


                systemMessage(e);
            });

            socket.on('update_rooms', function (rooms) {
                console.log('update_rooms', arguments);
                self.scope.$emit('updateRooms', rooms);
                self.users = rooms;
            });

            socket.on('nicknames', function (users) {
                console.log('nicknames', arguments);

                self.scope.$emit('updateUsers', users);
                self.users = users;
            });

            socket.on('announcement', function (a,b,c,d,e) {
                console.log('announcement', arguments);
                systemMessage.apply(this, arguments);
            });

            socket.on('user message', function(who, text) {
                console.log('user message', who, text.substr(0, 10) + '...');
                message(who, text);
            });

        };

    }
);
