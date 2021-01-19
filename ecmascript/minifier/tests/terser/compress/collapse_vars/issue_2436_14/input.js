var a = "PASS";
var b = {};
(function () {
    var c = a;
    c &&
        (function (c, d) {
            console.log(c, d);
        })(b, c);
})();
