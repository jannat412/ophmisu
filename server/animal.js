var method = Animal.prototype;

function Animal(config, nickname) {
    var nicknames = ['Darkstar', 'Stormborn', 'Kingslayer', 'Bloodraven', 'Mountain', 'LeechLord', 'Corpsekiller', 'Reek', 'Ned', 'Jon', 'Arya', 'Snow', 'Bran', 'Robb', 'Shae', 'Jeor', 'Khal', 'Stark', 'Sansa', 'Jorah', 'Jaime', 'Theon', 'Tywin', 'Tarly', 'Petyr', 'Varys', 'Tarth', 'Bronn', 'Davos', 'Gilly', 'Drogo', 'Tyrion', 'Cersei', 'Sandor', 'Gendry', 'Tyrell', 'Talisa', 'Eddard', 'Ramsay', 'Bolton', 'Daario', 'Robert', 'Mormont', 'Clegane', 'Greyjoy', 'Samwell', 'Joffrey', 'Catelyn', 'Baelish', 'Brienne', 'Ygritte', 'Stannis', 'Tormund', 'Naharis', 'Viserys', 'Daenerys', 'Margaery', 'Seaworth', 'Lannister', 'Targaryen', 'Baratheon', 'Missandei', 'Melisandre', 'Giantsbane'];
    var self = this;
    this.nickname = nickname || nicknames[this.rand(0, nicknames.length-1)];
    this.config = config;
	if (this.config.useRandomSuffix) {
		this.nickname += '-' + this.rand(1, 9999);
	}
    this.userData = {
        socketId: ''
    };
    this.socket = require('socket.io-client')('http://' + config.app.hostname + ':' + config.app.httpPort, {
        forceNew: true
    });

    this.socket.on('connect', function(){
        self.log('Connected ' + self.socket.id);
        self.userData.socketId = self.socket.id;
        if (self.config.chatter) {
            self.chatter();
        }
    });
    this.socket.on('event', function(data){
        self.log('Event', data);
    });

    this.socket.on('ping', function(code) {
        code = self.userData.socketId;
        //self.log('Ping? Pong ' + code + '!');
        self.socket.emit("pong", {socketId: self.userData.socketId, code: code});
    });
    this.socket.on('user_data', function(data) {
        self.userData = data;
    });
    this.socket.on('user message', function(who, text) {
        //console.log('user message', who, text);
    });

    this.socket.on('disconnect', function(){
        self.log('Disconnected');
    });

    this.connect();
}

method.connect = function() {
    return this.socket.emit('nickname', {'nickname': this.nickname});
};

method.disconnect = function() {
    return this.socket.disconnect();
};
method.log = function (text) {
    return console.log('[' + this.nickname + '] ' + text); // Array.prototype.slice.call(arguments, 0)
};

method.readFile = function(input) {
    var fs = require('fs');
    var lines = fs.readFileSync(input, 'utf8').split('\n');
    return lines;
};

method.say = function(line) {
  this.socket.emit("user message", line);
};

method.rand = function(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
};

method.chatter = function() {
    var self = this;
    self.lines = this.readFile('./text.txt');
    self.delay = this.rand(2000, 12000);
    self.log("Chat in " + self.delay);
    setTimeout(function() {
        var line = self.lines[Math.floor(Math.random()*self.lines.length)];
        self.say(line);
        self.chatter();
    }, self.delay);
};

module.exports = Animal;