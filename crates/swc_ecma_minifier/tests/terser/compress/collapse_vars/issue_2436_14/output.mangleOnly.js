var n = "PASS";
var o = {};
(function () {
    var a = n;
    a &&
        (function (n, o) {
            console.log(n, o);
        })(o, a);
})();
