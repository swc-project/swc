export var _path = function(r, t, a, n) {
    var e = r + "/" + t;
    if (!n) {
        e += "-min";
    }
    e += "." + (a || CSS);
    return e;
};
