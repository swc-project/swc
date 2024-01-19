_.shuffle = function(obj) {
    var rand, index = 0, shuffled = [];
    return each(obj, function(value) {
        shuffled[index - 1] = shuffled[rand = _.random(index++)], shuffled[rand] = value;
    }), shuffled;
};
