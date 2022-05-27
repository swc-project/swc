function a() {
    console.log("x");
}
function c() {
    console.log("y");
}
function b() {
    console.log("z");
}
(function(c, a, d) {
    function b() {
        console.log("FAIL");
    }
    return b + a();
})(a(), function() {
    return c();
}, b());
