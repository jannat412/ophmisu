var config = require('./config');

config.app.hostname = process.argv[2] || config.app.hostname;
config.app.httpPort = process.argv[3] || config.app.httpPort;

var Animal = require("./animal.js");
new Animal(config);
