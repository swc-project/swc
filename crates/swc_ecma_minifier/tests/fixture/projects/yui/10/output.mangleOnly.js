export var _path = function(a, b, c, d) {
    var e = a + "/" + b;
    if (!d) {
        e += "-min";
    }
    e += "." + (c || CSS);
    return e;
};
