exports.withStyles = t;
function n(n) {
    if (typeof n !== "function") {
        throw new TypeError();
    }
    Object.create(n);
}
function t() {
    var t = EXTERNAL();
    return (function(t) {
        n(t);
        function f() {}
    })(t);
}
