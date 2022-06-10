function a(c, d) {
    var a;
    if (c > 0) {
        var b = "hello";
    } else {
        var b = "howdy";
    }
    if (d > 0) {
        a = b.substr(0, 2);
    }
    return a;
}
module.exports = a;
