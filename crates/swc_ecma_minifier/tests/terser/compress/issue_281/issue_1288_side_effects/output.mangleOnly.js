if (w);
else {
    (function n() {})();
}
if (!x) {
    (function () {
        x = {};
    })();
}
if (y) (function () {})();
else
    (function (n) {
        return n;
    })(0);
