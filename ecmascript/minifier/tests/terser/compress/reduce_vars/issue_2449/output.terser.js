var a = "PASS";
function g() {
    return (function () {
        return a;
    })();
}
(function () {
    var a = "FAIL";
    if (a == a) console.log(g());
})();
