var a = "PASS";
var b = {};
(function () {
    a &&
        (function (c, d) {
            console.log(c, d);
        })(b, a);
})();
