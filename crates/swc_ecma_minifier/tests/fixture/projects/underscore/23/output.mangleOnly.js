_.once = function(n) {
    var r = false, t;
    return function() {
        if (r) return t;
        r = true;
        t = n.apply(this, arguments);
        n = null;
        return t;
    };
};
