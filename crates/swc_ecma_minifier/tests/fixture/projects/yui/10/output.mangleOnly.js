export var _path = function(r, n, t, a) {
    var e = r + "/" + n;
    if (!a) {
        e += "-min";
    }
    e += "." + (t || CSS);
    return e;
};
