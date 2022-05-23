var a = "PASS";
function f() {
    return a;
}
function g() {
    return f();
}
(function () {
    var a = "FAIL";
    if (a == a) console.log(g());
})();
