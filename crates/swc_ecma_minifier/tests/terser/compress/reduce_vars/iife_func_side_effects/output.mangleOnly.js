function a() {
    console.log("x");
}
function b() {
    console.log("y");
}
function c() {
    console.log("z");
}
(function(a, b, c) {
    function d() {
        console.log("FAIL");
    }
    return d + b();
})(a(), function() {
    return b();
}, c());
