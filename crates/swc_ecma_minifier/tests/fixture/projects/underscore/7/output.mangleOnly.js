_.partial = function(a) {
    var b = slice.call(arguments, 1);
    return function() {
        return a.apply(this, b.concat(slice.call(arguments)));
    };
};
