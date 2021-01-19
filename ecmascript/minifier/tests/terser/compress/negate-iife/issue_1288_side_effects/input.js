if (w);
else {
    (function f() {})();
}
if (!x) {
    (function () {
        x = {};
    })();
}
if (y) (function () {})();
else
    (function (z) {
        return z;
    })(0);
