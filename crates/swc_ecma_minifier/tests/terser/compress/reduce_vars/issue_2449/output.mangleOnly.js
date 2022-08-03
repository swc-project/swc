var n = "PASS";
function r() {
    return n;
}
function t() {
    return r();
}
(function() {
    var n = "FAIL";
    if (n == n) console.log(t());
})();
