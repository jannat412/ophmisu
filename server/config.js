var config = {};

config.ophmisu = {};
config.ophmisu.rooms = ['trivia', 'radio'];
config.ophmisu.defaultRoom = 'trivia';
config.ophmisu.triviaRoom = 'trivia';
config.auto_start = true;

config.app = {};
config.app.debug = true; // set DEBUG=*,-not_this
config.app.hostname = 'dev.ophmisu.com';
config.app.httpPort = 2013;
config.app.httpsPort = 2014;
config.app.developer = ''; // developer's nickname

config.app.cert = {};
config.app.cert.key = '/home/w/apps/ophmisu/server/cert/trivia.io.key';
config.app.cert.crt = '/home/w/apps/ophmisu/server/cert/certificate-29616.crt';
config.app.cert.pem = '/home/w/apps/ophmisu/server/cert/GandiStandardSSLCA.pem';


config.database = {};
config.database.name = process.env.DATABASE_NAME || 'ophmisu';
config.database.username = process.env.DATABASE_USERNAME || 'ophmisu';
config.database.password = process.env.DATABASE_PASSWORD || '';
config.database.hostname = process.env.DATABASE_HOSTNAME || '127.0.0.1';

module.exports = config;