exports.withStyles = t;
function n(t) {
    if (typeof t !== "function") {
        throw new TypeError();
    }
    Object.create(t);
}
function t() {
    var t = EXTERNAL();
    return (function(t) {
        n(t);
        function e() {}
    })(t);
}
