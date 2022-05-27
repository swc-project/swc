export var _path = function(b, c, d, e) {
    var a = b + "/" + c;
    if (!e) {
        a += "-min";
    }
    a += "." + (d || CSS);
    return a;
};
