// rename this to `local.config.js` and add your server specific parameters here

module.exports = function(config) {
    config.app.hostname = 'dev.ophmisu.com';

    return config;
}