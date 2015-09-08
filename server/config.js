var config = {};

config.ophmisu = {};
config.ophmisu.rooms = ['trivia', 'radio'];
config.ophmisu.defaultRoom = 'trivia';
config.ophmisu.triviaRoom = 'trivia';
config.ophmisu.autoStart = true;

config.app = {};
config.app.debug = true; // set DEBUG=*,-not_this
config.app.hostname = 'ophmisu.com';
config.app.httpPort = 2013;
config.app.httpsPort = 2014;
config.app.developer = ''; // developer's nickname

config.app.cert = {};
config.app.cert.key = __dirname + '/cert/ophmisu.com/server.key';
config.app.cert.crt = __dirname + '/cert/ophmisu.com/server.crt';
config.app.cert.pem = __dirname + '/cert/ophmisu.com/sub.class1.server.ca.pem';

config.database = {};
config.database.name = process.env.DATABASE_NAME || 'ophmisu';
config.database.username = process.env.DATABASE_USERNAME || 'ophmisu';
config.database.password = process.env.DATABASE_PASSWORD || '';
config.database.hostname = process.env.DATABASE_HOSTNAME || '127.0.0.1';

module.exports = config;