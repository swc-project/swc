_.partial = function(c) {
    var l = slice.call(arguments, 1);
    return function() {
        return c.apply(this, l.concat(slice.call(arguments)));
    };
};
