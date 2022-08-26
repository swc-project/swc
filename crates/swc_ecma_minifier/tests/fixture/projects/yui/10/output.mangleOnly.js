export var _path = function(r, n, t, a) {
    var i = r + "/" + n;
    if (!a) {
        i += "-min";
    }
    i += "." + (t || CSS);
    return i;
};
