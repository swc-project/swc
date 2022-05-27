_.once = function(a) {
    var b = false, c;
    return function() {
        if (b) return c;
        b = true;
        c = a.apply(this, arguments);
        a = null;
        return c;
    };
};
