function a(a, b) {
    var c;
    if (a > 0) {
        var d = "hello";
    } else {
        var d = "howdy";
    }
    if (b > 0) {
        c = d.substr(0, 2);
    }
    return c;
}
module.exports = a;
