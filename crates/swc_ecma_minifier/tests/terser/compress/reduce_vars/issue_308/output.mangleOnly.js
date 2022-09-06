exports.withStyles = n;
function t(t) {
    if (typeof t !== "function") {
        throw new TypeError();
    }
    Object.create(t);
}
function n() {
    var n = EXTERNAL();
    return (function (n) {
        t(n);
        function e() {}
    })(n);
}
