var app = require('./app.js');
var Users = require("./users.js");
var events = require('events'),
    util = require('util'),
    config = require('./config');

String.prototype.toCamel = function () {
    //return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
    return this.replace(/_([a-z])/g, function (g) {
        return g[1].toUpperCase()
    });
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
String.prototype.replaceAt = function (index, character) {
    if (character == undefined) {
        return index;
    }
    return this.substr(0, index) + character + this.substr(index + character.length);
}

String.prototype.escapeHtml = function (index, character) {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}


var Ophmisu = function Ophmisu() {
    //defining a var instead of this (works for variable & function) will create a private definition
    var self = this;

    var socketList = {};

    this.dbConfig = {
        multipleStatements: true,
        database: config.database.name,
        host: config.database.hostname,
        user: config.database.username,
        password: config.database.password
    };


    this.mysql = require('mysql'); // https://github.com/felixge/node-mysql
    this.db;
    this.users;

    this.config = {};
    this.config.auto_start = config.ophmisu.autoStart || false;
    this.config.level = 8;
    this.config.domain = "math";
    this.config.speed = 8000;

    this.status = 0;
    this.ID = 0;

    this.cheat = false;
    this.currentHint = 0;
    this.totalHints = 4;
    this.currentQuestion = '';
    this.q;

    this.nickname = "Monolog";
    this.hintMaskPositions = [];


    // cache stuff here
    this.top;


    this.init = function (no_auto_start) {
        self.connect();
        self.setupBinds();
    };

    this.test = function (arg) {
        console.log('test: ' + arg);
    };
    this.queue = function (method, args) {
        this[method](args);
    };
    this.connect = function () {
        console.log("Connecting to database..");
        self.db = self.mysql.createConnection(self.dbConfig);
        self.db.connect(function (err) {
            if (err) {
                console.log("Failed connecting to database. Retrying in a few moments..");
                setTimeout(function () {
                    self.connect();
                }, 20000);
            }
            else {
                console.log("Connected to database.");
                self.updateRanks();
                self.users = new Users(self.db);
                if (self.config.auto_start == true) {
                    console.log("Autostarting game.. " + self.config.auto_start);
                    self.start();
                }
            }
        });
        self.db.on('error', function (err) {
            console.log('db error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                self.connect();                     // lost due to either server restart, or a
            } else {                                      // connnection idle timeout (the wait_timeout
                throw err;                                  // server variable configures this)
            }
        });
    };


    this.msg = function (text) {
        app.io.to('trivia').emit('user message', self.nickname, text);
        app.ios.to('trivia').emit('user message', self.nickname, text);
        // app.io.to('trivia').emit('user message', self.nickname, text);
        // app.io.to('trivia').emit('user message', self.nickname, text);
        // app.ios.to('trivia').emit('user message', self.nickname, text);
        // app.io.to('trivia').emit('user message', self.nickname, text);
        flog('user message', [self.nickname, text]);
    };

    this.start = function () {
        //self.bind('db_change_event');
        self.msg("Jocul a inceput! (" + self.config.speed + ")");
        self.status = 1;
        self.currentHint = 0;
        self.ID = setInterval(function () {
            self.tick();
        }, self.config.speed);
    };

    this.stop = function () {
        self.msg("Jocul a fost oprit!");
        self.status = 0;
        self.currentHint = 0;
        self.q = null;
        clearInterval(self.ID);
    };
    this.getGameStatus = function () {
        if (self.status == 0)
            return "Jocul este momentan oprit";
        if (self.q && self.q.question) {
            return "Intrebarea curenta: " + self.q.question;
        }
        else {
            return "Jocul este pornit.";

        }
    };


    this.tick = function () {
        if (self.q == undefined) {
            self.nextQuestion();
            return;
        }
        self.currentHint++;
        if (self.currentHint <= self.totalHints) {
            self.msg({
                text: self.q.question.escapeHtml(),
                tags: self.q.tags,
                author: self.q.author
            });
            self.msg("Sugestia " + self.currentHint + "/" + self.totalHints + ": " + self.getHint() + "");
        }
        else {
            self.msg("Timeout: raspunsul corect era: <b>" + self.q.answer + "</b>");
            self.q = undefined;
        }
    }

    this.getHint = function () {
        var answer = self.q.answer;
        var length = answer.length;
        if (self.hint == undefined || self.hint == "") {
            self.hint = answer.replace(/[a-zA-Z0-9]/g, "*");
            self.hintMaskPositions = [];

            for (var i = 0; i < self.hint.length; i++) {
                if (self.hint.charAt(i) == "*") {
                    self.hintMaskPositions.push(i);
                }
            }
            self.hintMaskPositions.shuffle();

        }
        else if (self.hintMaskPositions.length >= 0) {
            var pos = self.hintMaskPositions.pop();
            if (typeof(answer[pos]) == 'undefined') {
                console.log('pre-mortem answer', self.q.answer, 'hintMaskPositions', self.hintMaskPositions);
            }

            self.hint = self.hint.replaceAt(pos, answer[pos]);
        }
        var newHint = '<span>' + self.hint + '</span>';

        if (self.currentHint == 1) newHint += " (din " + self.q.answer.length + " caractere)";
        //if (self.cheat) newHint += " ("+self.q.answer+")";
        return newHint;
    }
    this.nextQuestion = function () {
        self.currentHint = 0;
        self.hint = "";

        var query = '' +
                'SELECT ' +
                    'q.*, ' +
                    'u.username AS author, ' +
                    'GROUP_CONCAT(t.name SEPARATOR \', \') AS tags, ' +
                    'COUNT(t.name) AS tags_count ' +
                'FROM questions AS q ' +
                    'JOIN question_tags AS qt ON qt.question_id = q.id ' +
                    'JOIN tags AS t ON t.id = qt.tag_id ' +
                    'LEFT JOIN users AS u ON u.id = q.author_id ' +
                'WHERE t.name IN ( \'HTML\', \'CSS\', \'Frontend\' ) ' +
                'GROUP BY q.id ' +
                'ORDER BY RAND() LIMIT 0,1'
            ;
        self.db.query(query, function (err, results) {
            self.q = results[0];
            self.totalHints = Math.floor(self.q.answer.length * (self.config.level / 10));
        });
    };

    this.setDomain = function (domain) {
        self.config.domain = domain;
        self.msg("Domain set to: " + domain);
    };
    this.getDomains = function (domain) {
        self.db.query("SELECT name FROM tags LIMIT 0,10", function (err, results) {
            if (results.length != 0) {
                var lines = [];
                for (var i in results) {
                    var tag = results[i];
                    if (!tag || !tag.name) {
                        continue;
                    }
                    lines.push(tag.name);
                }
                self.msg("Available domains: " + lines.join(",&nbsp;"));
            }
        });
    };
    this.setLevel = function (nickname, level) {
        if (level < 1) {
            self.msg("Nivelul curent: <b>" + self.config.level + "</b>");
            return;
        }
        self.msg("<b>" + nickname + "</b> schimba nivelul la <b>" + level + "</b>");
        self.config.level = level;
    };
    this.setSpeed = function (nickname, value) {
        if (value < 1) {
            self.msg("Current speed: <b>" + self.config.speed + "</b>");
            return;
        }
        self.msg("<b>" + nickname + "</b> changes speed to <b>" + value + "</b>");
        self.config.speed = value;
        self.stop();
        self.start();
    };
    this.toggleCheat = function () {
        self.cheat = !self.cheat;
    };
    this.correctAnswer = function (nickname, answer, userData, prevRank) {
        var congrats_1 = ['Congratulations!', 'Congrats!', 'Felicitations!', 'Hip, hip, hurrah!', 'Three cheers!', 'Kudos!', 'Hats off!', 'Mazel tov!', 'Awesome!', 'Fantastic!'];
        var congrats_2 = ['High five!', 'Well done!', 'Good job.', 'Pretty good!', 'That\'s great!', 'Nice one.', 'Good.']
        var ready = ['Next!', 'Next question.', 'Get ready for the next question..'];
        ready.shuffle();
        congrats_2.shuffle();
        var message = ''
        message += '' + congrats_2.pop();
        message += " <b>" + nickname + "</b> answers <b>correctly</b>: <em>" + answer + "</em> and wins 1 point.";

        var newRank = userData.rank;
        if (userData) {
            if (prevRank == 0) {
                prevRank = newRank + 1;
            }
            if (prevRank > newRank) {
                var ranksAdvanced = prevRank - newRank;
                message += " <b>" + nickname + "</b> is now <b>place #" + newRank + '</b>';
                message += ", advancing " + ranksAdvanced + ' ' + (ranksAdvanced == 1 ? 'place' : 'places') + '.';
                if (newRank == 1) {
                    congrats_1.shuffle();
                    message += ' <b>' + congrats_1.pop() + '</b>';
                }
            } else {
                message += " <b>" + nickname + "</b> is on <b>place #" + newRank + '</b>.';
            }
        } else {
            message += ' Your score will NOT be saved - please login or register first.';
        }

        message += ' ' + ready.pop();
        self.msg(message);
    }
    this.checkAnswer = function (nickname, msg) {
        if (self.q == undefined) return;
        if (msg.toLowerCase() == self.q.answer.toLowerCase()) {
            var answer = self.q.answer;
            self.q = undefined;
            self.db.query("SELECT * FROM users WHERE username = ?", nickname, function (err, results) {
                if (results.length == 0) {
                    self.updateRanks(function() {
                        self.correctAnswer(nickname, answer, false);
                    });
                    /*console.log('Creating user ' + nickname);
                    self.db.query('INSERT INTO users SET ?',
                        {
                            username: nickname,
                            username_canonical: nickname,
                            email: nickname + '@ophmisu.com',
                            email_canonical: nickname + '@ophmisu.com',
                            roles: 'a:0:{}',
                            score: 1,
                            rank: 0
                        }, function (err, result) {
                            if (err) throw err;
                            var user_id = result.insertId;
                            self.updateRanks();
                    });*/
                } else {
                    console.log('Updating user ' + nickname);
                    var prevRank = results[0].rank;
                    self.db.query("UPDATE users SET score = score+1 WHERE username = '" + nickname + "'", function(err, results) {
                        if (err) {
                            throw err;
                        }
                        self.updateRanks(function() {
                            self.db.query("SELECT * FROM users WHERE username = ?", nickname, function (err, results) {
                                if (err) {
                                    throw err;
                                }
                                self.correctAnswer(nickname, answer, results[0], prevRank);

                            });
                        });
                    });
                }
            });

        }
    };

    this.updateRanks = function (callback) {
        console.log('Updating ranks...');
        self.db.query("SET @rank=0; SET @score=-1; UPDATE users SET rank=IF(@score=(@score:=score), @rank, @rank:=@rank+1) WHERE score > 0 ORDER BY score DESC",
            function (err, results) {
                if (err) {
                    throw err;
                }
                if (callback) {
                    callback();
                }
                self._emit("top_changed");
            }
        );
    }
    // Ranking related stuff
    this.getTop = function (announce) {

        var top = self.top;
        self.db.query("SELECT username,score,rank FROM users WHERE score > 0 ORDER BY rank ASC LIMIT 0, 10", function (err, results) {
            if (err) {
                throw err;
            }
            self.top = results;
            self._emit("local_top_updated");
            if (announce === true) {
                self.showTop();
            }
        });
        return top;
    };
    this.showPong = function (nickname) {
        self.msg("Pong: " + nickname);
    };
    this.showHelp = function () {
        self.msg("Available commands: " + " <br />\
		!!      - displays another hint<br />\
		!skip   - jumps the current question<br />\
		!start  - starts the game<br />\
		!stop   - stops the game<br />\
		!top    - shows a list of top 10 players<br />\
		!level [1-10]       - shows or changes game's difficulty level<br />\
		!speed [1000-10000] - shows or changes game's speed<br />\
		!domains - shows a list of available question domains<br />\
		!help    - shows this help message<br />\
		!ping    - ping-pong round-trip test (NIY)<br />\
		");
    };
    this.emitTop = function () {
        app.io.sockets.emit('top', self.top);
        app.ios.sockets.emit('top', self.top);
    };
    this.showTop = function () {
        var top = self.getTop(false);

        if (typeof(top) == 'undefined') {
            return self.getTop(true);
        }
        var lines = [];
        for (var i in top) {
            var user = top[i];
            if (!user || !user.username) continue;
            var line = user.rank + ") " + user.username + "  " + user.score;
            lines.push(line);
        }
        self.msg("Top: " + lines.join("&nbsp;&nbsp;&nbsp;"));
    };


    this._emit = function (event) {
        console.log("Emitting `" + event + '`');
        self.emit(event);
    };
    this.bind = function (event, action) {
        if (action == undefined) {
            action = ("on_" + event.replace("_event", "")).toCamel();
        }
        if (!self[action]) {
            console.log("[Bind] Unable to bind event `" + event + "` to non-existent action `" + action + "`");
            return;
        }
        console.log("[Bind] event `" + event + "` to `" + action + "`");
        self.on(event, self[action]);
    };
    this.setupBinds = function () {
        self.bind("top_changed");
        self.bind("local_top_updated");
    };


    // Events actions
    this.onLocalTopUpdated = function () {
        app.io.sockets.emit('top', self.top);
        app.ios.sockets.emit('top', self.top);
    };
    this.onTopChanged = function () {
        self.getTop();
    };


    if (Ophmisu.caller != Ophmisu.getInstance) {
        throw new Error("This object cannot be instantiated");
    }
}
Ophmisu.prototype = new events.EventEmitter;

Ophmisu.instance = null;
Ophmisu.getInstance = function () {
    if (this.instance === null) {
        this.instance = new Ophmisu();
    }
    return this.instance;
}
function randomXToY(minVal, maxVal, floatVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);
}

module.exports = Ophmisu.getInstance();