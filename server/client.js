var config = require('./config');

var number = process.argv[2] || 1;
config.app.hostname = process.argv[3] || config.app.hostname;
config.app.httpPort = process.argv[4] || config.app.httpPort;
config.chatter = process.argv[5] || config.chatter;

console.log('Spawning ' + number + ' pets');

for (var i = 0; i < number; i++) {
    var Animal = require("./animal.js");
    new Animal(config);
}


