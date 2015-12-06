function htmlEscape(text) {
	return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g, '&#039;');
}
var fs = require('fs');
var utils = require('./utils');
var config = require('./config');

try {
    if (fs.openSync('./local.config.js', 'r')) {
        config = require('./local.config')(config);
    }
} catch (e) {}

var rooms = config.ophmisu.rooms,
    defaultRoom = config.ophmisu.defaultRoom,
    triviaRoom = config.ophmisu.triviaRoom ;

//  set DEBUG=*,-not_this
var debug = require('debug')('app');
debug('booting %s', "");

//var winston = require('winston');
//winston.add(winston.transports.File, { filename: 'logs/log.log' });
//winston.remove(winston.transports.Console);


var options = {
	requestCert: true,
	rejectUnauthorized: false,
	key: fs.readFileSync(config.app.cert.key),
	cert: fs.readFileSync(config.app.cert.crt),
	ca: fs.readFileSync(config.app.cert.pem)
};


// var express = require('express');
// var sio = require('socket.io');

var express = require('express');

var app = express();
var apps = express();

var http = require('http').createServer(app);
var https = require('https').createServer(options, apps);

var sio = require('socket.io')(http);
var sios = require('socket.io')(https);



/* app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

 */
http.listen(2013, function () {
	var addr = http.address();
	console.log('   app listening on ' + addr.address + ':' + addr.port);
});

https.listen(2014, function () {
	var addr = https.address();
	console.log('   app listening on ' + addr.address + ':' + addr.port);
}); 


var nicknames = {}, sids = {};


exports.io = sio;
exports.ios = sios;
var ophmisu = require("./engine.js");
ophmisu.init();
initApp(sio, 'http');
initApp(sios, 'https');
initPing(sio);



var flogData = [], 
	flogMaxIndex = 30,
	flogDataIndex = 0;
function flog(type, args)
{
	var time = new Date();
	var data = [Math.ceil(time.getTime()/1000), type, args];
	flogData.unshift(data);
	flogDataIndex++;
	if (flogDataIndex > flogMaxIndex)
	{
		flogData.pop();
	}
}
global.flog = flog;
setInterval(function() { 
	var data = JSON.stringify(flogData),
        file = __dirname + "/../client/web/activity.txt";
	fs.writeFile(file, data);
}, 1000*10);




var forbiddenNicknames = [];
forbiddenNicknames.push(ophmisu.nickname);
forbiddenNicknames.push("pula", "cacat", "muie", "rahat", "pizda");
function isForbiddenNickname(nickname)
{
	if (!nickname) return true;
	var t= forbiddenNicknames.length;
	nickname = nickname.toLowerCase();
	for (var i = 0; i < t; i++)
	{
		var n = forbiddenNicknames[i];
		if (nickname == n) return true;
		if (nickname.indexOf(n) != -1) return true;
	}
	return false;
}

function initPing(io) {
    setInterval(function() {
        for (var i in sids) {
            //var sid = sids[i];
            //console.log('[PING] emitting ' + sid.socketId + ' to ' + sid.nicknmame);
            //io.sockets.socket(sid.socketId).emit("ping", sid);
        }
        var code = utils.rand(1000, 9999);
        io.sockets.emit('ping', code);
    }, 3000);
}
function initPong(socket) {
    socket.on('pong', function(a, b, c, d, e) {
        var sid = sids[socket.id];
        console.log('[PONG] got ' + '' + ' from ' + sid.nickname);
        console.log(this.socket);
        console.log(a, b, c, d, e);
    });
}

function initApp(ioi, iname)
{
    console.log('Initializing routes for '+iname);

	ioi.sockets.on('connection', function (socket) {
        console.log('Got socket connection');

        initPong(socket);

        // if socket hasn't presented a nickname after a while, just kill it
        console.log('started killer');
        socket.killId = setTimeout(function() {
            //if (!)
            console.log('killer socket.nickname', socket.nickname);
            if (!socket.nickname) {
                socket.disconnect();
                console.log('Killing socket..');
                return;
            }
            //console.log(this == socket);
        }, 2000);
		
		socket.on('nickname', function (args, fn) {
			var nick = args.nickname;
			console.log('Attempt to connect as `'+nick+'`');
			var prefered_room = args.default_room;
            if (!fn) {
                fn = socket.ack;
            }
			if (nicknames[nick] || isForbiddenNickname(nick)) {
				fn(true);
			} else {
				fn(false);
				nicknames[nick] = socket.nickname = nick;
				sids[socket.id] = {
                    socketId: socket.id,
                    nickname: nick,
                    lastPingTime: new Date()
                };
				
				var room = defaultRoom;
				if (typeof(prefered_room) != 'undefined' && rooms.indexOf(prefered_room) > -1)
				{
					room = prefered_room;
				}
				
				socket.room = room;
				socket.join(room);
				socket.broadcast.to(room).emit('announcement', 1001, nick, room);
				socket.emit('update_rooms', rooms, room);
                socket.emit("user_data", {socketId: socket.id});
				console.log("Connected `"+nick+"` " + socket.id);
				console.log(args);
				//socket.broadcast.emit('announcement', nick + ' connected');
				
				
				
				
				sio.sockets.emit('nicknames', nicknames);
				sios.sockets.emit('nicknames', nicknames);
				// xxx ioi.sockets.socket(sids[nick]).emit("user message", ophmisu.nickname, ophmisu.getGameStatus());
				
				//ioi.sockets.emit('top', ophmisu.getTop());
				
			}
		});
		socket.on('switchRoom', function(newroom){
			// todo: update usernames from each room
			socket.leave(socket.room);
			socket.join(newroom);
			socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
			// sent message to OLD room
			socket.broadcast.to(socket.room).emit('announcement', socket.nickname + ' has left the room "'+socket.room+'"');
			// update socket session room title
			socket.room = newroom;
			socket.broadcast.to(newroom).emit('announcement', socket.nickname + ' has joined room "'+socket.room+'"');
			ioi.sockets.socket(sids[socket.id].socketId).emit("announcement", 'You have joined room "'+socket.room+'"');
			socket.emit('update_rooms', rooms, newroom);
		});

		socket.on('disconnect', function () {
			if (!socket.nickname) { console.log('*ops on disconnection, missing nickname..'); return; }
			console.log("Disconnected `"+socket.nickname+"`");
			delete nicknames[socket.nickname];
			socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
			socket.broadcast.emit('nicknames', nicknames);
		});
		
		socket.on('user message', function (data) {
			var msg = data;
			if (typeof(msg) != "string") msg = data.message;
			var MESSAGE_MAX_LENGTH = 255;
			if (msg.length > MESSAGE_MAX_LENGTH && socket.nickname != ophmisu.nickname) msg = msg.substring(0, MESSAGE_MAX_LENGTH-5)+' (..)';
            
			//socket.in(socket.room).broadcast.emit('user message', socket.nickname, htmlEscape(msg));

            sio.sockets.emit('user message', socket.nickname, htmlEscape(msg));
            sios.sockets.emit('user message', socket.nickname, htmlEscape(msg));
            debug("Broadcasting message to "+sio.sockets.length+" HTTP sockets");
            debug("Broadcasting message to "+sios.sockets.length+" HTTPS sockets");
            
            if (msg == "!help") ophmisu.showHelp();
			if (msg == "!!") ophmisu.tick();
			if (msg == "!skip") ophmisu.nextQuestion();
			if (msg == "!start") ophmisu.start();
			if (msg == "!domains") ophmisu.getDomains();
			if (msg == "!math") ophmisu.setDomain("math");
			if (msg == "!stop") ophmisu.stop();
			if (msg == "!ping") ophmisu.showPong(socket.nickname);
			if (msg.substring(0,6) == "!level") {
				var level = msg.split(/ /);
				level = (level[1] ? parseInt(level[1]) : 0);
				ophmisu.setLevel(socket.nickname, level);
			}
			if (msg.substring(0,6) == "!speed") {
				var speed = msg.split(/ /);
				speed = (speed[1] ? parseInt(speed[1]) : 0);
				ophmisu.setSpeed(socket.nickname, speed);
			}
			if (msg == "!top") ophmisu.showTop();

            if (socket.nickname == config.app.developer) {
                if (msg == "!crash") throw new Exception("WtfXxX");
                if (msg == "!cheat") ophmisu.toggleCheat();
            }

			ophmisu.checkAnswer(socket.nickname, msg);
			flog('user message', [socket.nickname, msg])
		});
	});

}



