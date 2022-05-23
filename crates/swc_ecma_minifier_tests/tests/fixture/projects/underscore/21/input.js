_.shuffle = function (obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function (value) {
        rand = _.random(index++);
        shuffled[index - 1] = shuffled[rand];
        shuffled[rand] = value;
    });
    return shuffled;
};
