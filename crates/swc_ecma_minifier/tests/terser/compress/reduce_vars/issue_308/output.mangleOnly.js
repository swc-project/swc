exports.withStyles = b;
function a(a) {
    if (typeof a !== "function") {
        throw new TypeError();
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
