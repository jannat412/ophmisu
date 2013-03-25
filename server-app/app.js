// must be cleaned
require('nodefly').profile(
    '???',
    'trivia.io'
);





//try {
function shallowStringify(obj, onlyProps, skipTypes) 
{
	var objType = typeof(obj);
	if(['function', 'undefined'].indexOf(objType)>=0) {
		return objType;
	} else if(['string', 'number', 'boolean'].indexOf(objType)>=0) {
		return obj; // will toString
	}
	// objType == 'object'
	var res = '{';
	for (p in obj) { // property in object
		if(typeof(onlyProps)!=='undefined' && onlyProps) {
			// Only show property names as values may show too much noise.
			// After this you can trace more specific properties to debug
			res += p+', ';
		} else {
			var valType = typeof(obj[p]);
			if(typeof(skipTypes)=='undefined') {
				skipTypes = ['function'];
			}
			if(skipTypes.indexOf(valType)>=0) {
				res += p+': '+valType+', ';
			} else {
				res += p+': '+obj[p]+', ';
			}
		}
	}
	res += '}';
	return res;
}

function htmlEscape(text) {
	return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g, '&#039;');
}






var rooms = ['trivia', 'radio'];
var defaultRoom = 'trivia';
var triviaRoom = 'trivia';


var express = require('express'),
  stylus = require('stylus'), 
  nib = require('nib'),
  sio = require('socket.io');
var fluidity = require('fluidity');

var app = express.createServer();
app.use(express.bodyParser());

var User = require("./user.js");

var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/log.log' });
winston.remove(winston.transports.Console);



app.configure(function () {
	app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
	app.use(express.static(__dirname + '/public'));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	function compile (str, path) {
		return stylus(str).set('filename', path).use(nib());
	};
});

app.get('/', function (req, res) {
	res.render('index', { layout: false });
});
app.get('/register', function (req, res) {
	res.render('register', { layout: false });
});



app.post('/register', function(req, res) {


	var username = req.param('username', null);
	var password = req.param('password', null);
	ophmisu.users.add(username, password, function(result, err) {
		var user_id = result;
		//res.send("Added as ID #"+user_id);
		res.render('register', { 
			layout: false, 
			locals: { 
				user_id: user_id 
			}
		});
	});
	//res.send('Username: ' + username+':' + password);
	
	//req.method = 'get'; 
	//res.redirect('/');
	//res.send();
});
/*
*/

app.listen(2013, function () {
	var addr = app.address();
	console.log('   app listening on http://' + addr.address + ':' + addr.port);
});

var io = sio.listen(app), nicknames = {}, sids = {};
io.set('log level', 1);


exports.io = io;
var ophmisu = require("./engine.js");
ophmisu.init();

//ophmisu.bind("db_change_event");
//setTimeout(function() { ophmisu.bindTest(); }, 3000);


io.sockets.on('connection', function (socket) {
	socket.on('nickname', function (args, fn) {
		var nick = args.nickname;
		console.log('Attempt to connect as `'+nick+'`');
		console.log(args);
		var prefered_room = args.default_room;
		if (nicknames[nick]) {
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
			
			
			
			
			io.sockets.emit('nicknames', nicknames);
			io.sockets.socket(sids[nick]).emit("user message", ophmisu.nickname, ophmisu.getGameStatus());
			
			//io.sockets.emit('top', ophmisu.getTop());
			
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
		io.sockets.socket(sids[socket.nickname]).emit("announcement", 'You have joined room "'+socket.room+'"');
		socket.emit('update_rooms', rooms, newroom);
	});

	socket.on('disconnect', function () {
		if (!socket.nickname) { console.log('*ops on disconnection, missing nickname..'); return; }
		console.log("Disconnected `"+socket.nickname+"`");
		delete nicknames[socket.nickname];
		socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
		socket.broadcast.emit('nicknames', nicknames);
	});
	
	socket.on('user message', function (msg) {
		socket.in(socket.room).broadcast.emit('user message', socket.nickname, htmlEscape(msg));
		if (msg == "!!") ophmisu.nextQuestion();
		if (msg == "!start") ophmisu.start();
		if (msg == "!math") ophmisu.setDomain("math");
		if (msg == "!stop") ophmisu.stop();
		if (msg == "!cheat") ophmisu.toggleCheat();
		if (msg.substring(0,6) == "!level") {
			var level = msg.split(/ /);
			level = (level[1] ? parseInt(level[1]) : 0);
			ophmisu.setLevel(socket.nickname, level);
		}
		if (msg == "!top") ophmisu.showTop();
		if (msg == "!crash") throw new Exception("WtfXxX");
		
		ophmisu.checkAnswer(socket.nickname, msg);
	});
});





/*
}
catch (e)
{
	console.log("WTFException", e);
	
}
*/