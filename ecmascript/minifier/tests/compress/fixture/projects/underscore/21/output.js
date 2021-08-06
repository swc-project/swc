_.shuffle = function(obj) {
    var rand, index = 0, shuffled = [];
    return each(obj, function(value) {
        rand = _.random(index++), shuffled[index - 1] = shuffled[rand], shuffled[rand] = value;
    }), shuffled;
};
