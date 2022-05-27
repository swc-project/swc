var a = "PASS";
function b() {
    return a;
}
function c() {
    return b();
}
(function() {
    var a = "FAIL";
    if (a == a) console.log(c());
})();
