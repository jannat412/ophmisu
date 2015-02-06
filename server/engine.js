var app = require('./app.js');
var Users = require("./users.js");
var events = require('events'),
	util = require('util');
	
String.prototype.toCamel = function(){
	//return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
	return this.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase() });
};

Array.prototype.shuffle = function () {
    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    }

    return this;
}
String.prototype.replaceAt=function(index, character) {
	if (character == undefined)
	{
		console.log("LALLALALAL!");
		console.log(index);
		console.log(character);
	}
	return this.substr(0, index) + character + this.substr(index+character.length);
}

String.prototype.escapeHtml=function(index, character) {
	return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g, '&#039;');
}



var Ophmisu = function Ophmisu(){
	//defining a var instead of this (works for variable & function) will create a private definition
	var self = this;
	
	var socketList = {};
	
	this.dbConfig = {
		database: 'trivia',
		host: '127.0.0.1',
		user: 'root',
		password: 'wsemd',
	};
	
	
	this.mysql      = require('mysql'); // https://github.com/felixge/node-mysql
	this.db;
	this.users;

	this.config = {};
	this.config.auto_start = false;
	this.config.level = 8;
	this.config.domain = "math";
	this.config.speed = 10000;
	
	this.status = 0;
	this.ID = 0;
	var totalQuestions = 0;
	
	this.cheat = false;
	this.currentHint = 0;
	this.totalHints = 4;
	this.currentQuestion = '';
	this.q;
	
	this.nickname = "Monolog";
	this.hintMaskPositions = [];
	
	
	// cache stuff here
	this.top;
	
	


	this.init = function(no_auto_start) 
	{
		self.connect();
		self.setupBinds();
	};
	
	this.test = function(arg)
	{
		console.log('test: ' +arg);
	};
	this.queue = function(method, args) {
		this[method](args);
	};
	this.connect = function()
	{
		console.log("Connecting to database..");
		self.db = self.mysql.createConnection(self.dbConfig);
		self.db.connect(function(err) {
			if (err)
			{
				console.log("Failed connecting to database. Retrying in a few moments..");
				setTimeout(function() {
					self.connect();
				}, 20000);
			}
			else
			{
				console.log("Connected to database.");
				self.users = new Users(self.db);
				if (self.config.auto_start == true)
				{
					console.log("Autostarting game.. " + self.config.auto_start);
					self.start();
				}
			}
		});
        self.db.on('error', function(err) {
            console.log('db error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                self.connect();                     // lost due to either server restart, or a
            } else {                                      // connnection idle timeout (the wait_timeout
                throw err;                                  // server variable configures this)
            }
        });
	};
	

	this.msg = function(text)
	{
		app.io.to('trivia').emit('user message', self.nickname, text);
		app.ios.to('trivia').emit('user message', self.nickname, text);
		// app.io.to('trivia').emit('user message', self.nickname, text);
		// app.io.to('trivia').emit('user message', self.nickname, text);
		// app.ios.to('trivia').emit('user message', self.nickname, text);
		// app.io.to('trivia').emit('user message', self.nickname, text);
		flog('user message', [self.nickname, text]);
	};
	
	this.start = function()
	{
		//self.bind('db_change_event');
		self.msg("Jocul a inceput! ("+self.config.speed+")");
		self.status = 1;
		self.currentHint = 0;
		self.ID = setInterval(function() {
			self.tick();
		}, self.config.speed);
	};

	this.stop = function()
	{
		self.msg("Jocul a fost oprit!");
		self.status = 0;
		self.currentHint = 0;
		self.q = null;
		clearInterval(self.ID);
	};
	this.getGameStatus = function() 
	{
		if (self.status == 0)
			return "Jocul este momentan oprit";
		if (self.q && self.q.question)
		{
			return "Intrebarea curenta: "+self.q.question;
		}
		else
		{
			return "Jocul este pornit.";
			
		}
	};

	
	
	this.tick = function()
	{
		if (self.q == undefined)
		{
			self.nextQuestion();
			return;
		}
		self.currentHint++;
		if (self.currentHint <= self.totalHints)
		{
			self.msg(self.q.question.escapeHtml());
			self.msg("Sugestia "+self.currentHint+"/"+self.totalHints+": "+self.getHint());
		}
		else
		{
			self.msg("Timeout: raspunsul corect era: <b>"+self.q.answer+"</b>");
			self.q = undefined;
		}
	}
	
	this.getHint = function()
	{
		var answer = self.q.answer;
		var length = answer.length;
		if (self.hint == undefined || self.hint == "")
		{
			//self.hint = Array(length+1).join("*");
			self.hint = answer.replace(/[a-zA-Z0-9]/g, "*");
			//self.hint+= " ("+answer+")";
			self.hintMaskPositions = [];

			for (var i = 0; i < self.hint.length; i++)
			{
				if (self.hint.charAt(i) == "*")
				{
					self.hintMaskPositions.push(i);
				}
			}
			self.hintMaskPositions.shuffle();
			
		}
		else
			if (self.hintMaskPositions.length >= 0)
			{
				var pos = self.hintMaskPositions.pop();
				self.hint = self.hint.replaceAt(pos, answer[pos]);
			}
		var newHint = self.hint;
		
		if (self.currentHint == 1) newHint += " (din "+self.q.answer.length+" caractere)";
		if (self.cheat) newHint += " ("+self.q.answer+")";
		return newHint;
	}
	this.nextQuestion = function()
	{
		self.currentHint = 0;
		self.hint = "";
		
		self.db.query("SELECT max(question_id) AS total FROM questions", function(err, results) {
			self.totalQuestions = results[0].total; 
			var where = 'question_id > 11459 ORDER BY RAND() LIMIT 0,1';
			var where = "question_id = "+randomXToY(1, self.totalQuestions);
			self.db.query("SELECT * FROM questions WHERE "+where, function(err, results) {
				self.q = results[0];
				self.totalHints = Math.floor(self.q.answer.length * (self.config.level/10));
			});
			
			
		});
	};

	this.setDomain = function(domain) {
		self.config.domain = domain;
		self.msg("Domain set to: "+domain);
	};
	this.getDomains = function(domain) {
		self.msg("Supported domains: math, general");
	};
	this.setLevel = function(nickname, level) {
		if (level < 1) 
		{
			self.msg("Nivelul curent: <b>"+self.config.level+"</b>");
			return;
		}
		self.msg("<b>"+nickname+"</b> schimba nivelul la <b>"+level+"</b>");
		self.config.level = level;
	};
	this.setSpeed = function(nickname, value) {
		if (value < 1) 
		{
			self.msg("Current speed: <b>"+self.config.speed+"</b>");
			return;
		}
		self.msg("<b>"+nickname+"</b> changes speed to <b>"+value+"</b>");
		self.config.speed = value;
		self.stop();self.start();
	};
	this.toggleCheat = function() {
		self.cheat = !self.cheat;
	};
	this.checkAnswer = function(nickname, msg) {
		if (self.q == undefined) return;
		if (msg.toLowerCase() == self.q.answer.toLowerCase())
		{
			self.q = undefined;
			self.msg("<b>"+nickname+"</b>, raspuns <b>corect</b>: "+msg+". Urmatoarea intrebare..");
			
			self.db.query("SELECT * FROM users WHERE nickname = ?", nickname, function(err, results) {
				if (results.length == 0)
				{
					console.log('Creating user '+nickname);
					self.db.query('INSERT INTO users SET ?', {nickname: nickname, score: 1}, function(err, result) {
						if (err) throw err;
						var user_id = result.insertId;
						self._emit("top_changed");
					});
				}
				else
				{
					console.log('Updating user '+nickname);
					self.db.query("UPDATE users SET score = score+1 WHERE nickname = '"+nickname+"'");
					self._emit("top_changed");
				}
			});

		}
	};
	
	// Ranking related stuff
	this.getTop = function(announce) 
	{
	
		var top = self.top;
		self.db.query("SELECT * FROM users ORDER BY score DESC LIMIT 0, 10", function(err, results) {
			self.top = results;
			self._emit("local_top_updated");
			if (announce) self.showTop();
		});
		return top;
	};
	this.showPong = function(nickname) {
		self.msg("Pong: "+nickname);
	};
	this.showHelp = function() {
		self.msg("Available commands: "+" <br />\
		!! - jumps the current question<br />\
		!start - starts the game<br />\
		!stop - stops the game<br />\
		!top - shows a list of top 10 players<br />\
		!level [1-10] - shows or changes game's difficulty level<br />\
		!speed [1000-10000] - shows or changes game's speed<br />\
		!domains - shows a list of available question domains<br />\
		!help - shows this help message<br />\
		!ping - ping-pong round-trip test (NIY)<br />\
		!crash - crashes the server (for testing purposes only)<br />\
		");
	};
	this.emitTop = function() {
		app.io.sockets.emit('top', self.top);
		app.ios.sockets.emit('top', self.top);
	};
	this.showTop = function() {
		var top = self.getTop();
		if (typeof(top) == 'undefined') { return self.getTop(true); }
		var lines = [];
		var rank = 1;
		for (var i in top)
		{
			var user = top[i];
			if (!user || !user.nickname) continue;
			var line = rank+") "+user.nickname+"  "+user.score;
			lines.push(line);
			rank++;
		}
		self.msg("Top: "+lines.join("&nbsp;&nbsp;&nbsp;"));
	};
	
	
	
	
	
	
	this._emit = function(event) {
		console.log("Emitting `"+event+'`');
		self.emit(event);
	};
	this.bind = function(event, action)
	{
		if (action == undefined)
		{
			action = ("on_"+event.replace("_event", "")).toCamel();
		}
		if (!self[action])
		{
			console.log("[Bind] Unable to bind event `"+event+"` to non-existent action `"+action+"`");
			return;
		}
		console.log("[Bind] event `"+event+"` to `"+action+"`");
		self.on(event, self[action]);
	};
	this.setupBinds = function() {
		self.bind("top_changed");
		self.bind("local_top_updated");
	};
	
	


	
	// Events actions
	this.onLocalTopUpdated = function() {
		app.io.sockets.emit('top', self.top);
		app.ios.sockets.emit('top', self.top);
	};
	this.onTopChanged = function() {
		self.getTop();
	};
	
	
	
	

	if(Ophmisu.caller != Ophmisu.getInstance){
		throw new Error("This object cannot be instantiated");
	}
}
Ophmisu.prototype = new events.EventEmitter;

Ophmisu.instance = null;
Ophmisu.getInstance = function(){
	if(this.instance === null){
		this.instance = new Ophmisu();
	}
	return this.instance;
}
function randomXToY(minVal,maxVal,floatVal)
{
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

module.exports = Ophmisu.getInstance();