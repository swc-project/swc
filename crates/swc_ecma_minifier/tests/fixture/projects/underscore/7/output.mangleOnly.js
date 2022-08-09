_.partial = function(a) {
    var n = slice.call(arguments, 1);
    return function() {
        return a.apply(this, n.concat(slice.call(arguments)));
    };
};
