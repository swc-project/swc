function n() {
    console.log("x");
}
function o() {
    console.log("y");
}
function t() {
    console.log("z");
}
(function(n, o, t) {
    function u() {
        console.log("FAIL");
    }
    return u + o();
})(n(), function() {
    return o();
}, t());
