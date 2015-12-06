var utils = function Utils() {}

utils.prototype.extend = function(target)
{
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

utils.prototype.rand = function(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
};

module.exports = new utils();