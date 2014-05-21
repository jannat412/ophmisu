function htmlEscape(text) { return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g, '&#039;'); }

var rooms = ['trivia', 'radio'];
var defaultRoom = 'trivia';
var triviaRoom = 'trivia';

var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/log.log' });
winston.remove(winston.transports.Console);


var fs = require('fs');
var options = {
	requestCert: true,
	rejectUnauthorized: false,
	key: fs.readFileSync('/home/w/apps/trivia.io/cert/trivia.io.key'),
	cert: fs.readFileSync('/home/w/apps/trivia.io/cert/certificate-29616.crt'),
	ca: fs.readFileSync('/home/w/apps/trivia.io/cert/GandiStandardSSLCA.pem')
};


var express = require('express');
var sio = require('socket.io');

var app = express.createServer();
var apps = express.createServer(options);



app.listen(2013, function () {
	var addr = app.address();
	console.log('   app listening on ' + addr.address + ':' + addr.port);
});

apps.listen(2014, function () {
	var addr = apps.address();
	console.log('   app listening on ' + addr.address + ':' + addr.port);
});

var io = sio.listen(app);
var ios = sio.listen(apps);
io.set('log level', 1);
ios.set('log level', 1);

var nicknames = {}, sids = {};


exports.io = io;
exports.ios = ios;
var ophmisu = require("./engine.js");
ophmisu.config.auto_start = true;
ophmisu.init();
initApp(io);
initApp(ios);




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
	var data = JSON.stringify(flogData);
	fs.writeFile("/home/w/www/trivia.play.ai/activity.txt", data); 
}, 1000*10);




var forbiddenNicknames = [];
forbiddenNicknames.push(ophmisu.nickname);
forbiddenNicknames.push("Monolog", "X", "", "root");
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

function initApp(ioi)
{
	ioi.sockets.on('connection', function (socket) {
		
		socket.on('nickname', function (args, fn) {
			var nick = args.nickname;
			console.log('Attempt to connect as `'+nick+'`');
			var prefered_room = args.default_room;
			if (nicknames[nick] || isForbiddenNickname(nick)) {
				fn(true);
			} else {
				fn(false);
				nicknames[nick] = socket.nickname = nick;
				sids[nick] = socket.id;
				
				var room = defaultRoom;
				if (typeof(prefered_room) != 'undefined' && rooms.indexOf(prefered_room) > -1)
				{
					room = prefered_room;
				}
				
				socket.room = room;
				socket.join(room);
				socket.broadcast.to(room).emit('announcement', nick + ' has join room "'+room+'"');
				socket.emit('update_rooms', rooms, room);
				console.log("Connected `"+nick+"`");
				//socket.broadcast.emit('announcement', nick + ' connected');
				ioi.sockets.emit('nicknames', nicknames);
				ioi.sockets.socket(sids[nick]).emit("user message", ophmisu.nickname, ophmisu.getGameStatus());
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
			ioi.sockets.socket(sids[socket.nickname]).emit("announcement", 'You have joined room "'+socket.room+'"');
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
			socket.in(socket.room).broadcast.emit('user message', socket.nickname, htmlEscape(msg));
			if (msg == "!help") ophmisu.showHelp();
			if (msg == "!!") ophmisu.nextQuestion();
			if (msg == "!start") ophmisu.start();
			if (msg == "!domains") ophmisu.getDomains();
			if (msg == "!math") ophmisu.setDomain("math");
			if (msg == "!stop") ophmisu.stop();
			if (msg == "!cheat") ophmisu.toggleCheat();
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
			if (msg == "!crash") throw new Exception("WtfXxX");
			
			ophmisu.checkAnswer(socket.nickname, msg);
			flog('user message', [socket.nickname, msg])
		});
	});
}