
var translator = angular.module('ophmisu.translator', ["sprintf"]);

translator.factory('translator', function() {
    var instance = {};

    instance.translate = function() {
        if (typeof(translationMap) == 'undefined' || translationMap == null) {
            return arguments.join(', ');
        }

        if (arguments.length > 0) {
            var args = Array.prototype.slice.call(arguments);

            return {text: translationMap[arguments[0]], args: args.slice(1)};
        }

        return arguments[0];
    }

    return instance;
});