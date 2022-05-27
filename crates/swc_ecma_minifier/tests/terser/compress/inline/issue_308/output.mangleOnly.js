exports.withStyles = b;
function a(a) {
    if (typeof a !== "function") {
        throw new TypeError("Super expression must be a function, not " + typeof a);
    }
    Object.create(a);
}
function b() {
    var b = EXTERNAL();
    return (function(b) {
        a(b);
        function c() {}
    })(b);
}
