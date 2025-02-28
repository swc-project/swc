function n() {
    console.log("x");
}
function c() {
    console.log("y");
}
function o() {
    console.log("z");
}
(function(c, n, l) {
    function o() {
        console.log("FAIL");
    }
    return o + n();
})(n(), function() {
    return c();
}, o());
