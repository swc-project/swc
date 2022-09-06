var n = "PASS";
function o() {
    return n;
}
function r() {
    return o();
}
(function () {
    var n = "FAIL";
    if (n == n) console.log(r());
})();
