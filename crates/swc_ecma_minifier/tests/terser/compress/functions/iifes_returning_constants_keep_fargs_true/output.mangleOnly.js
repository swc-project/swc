(function () {
    return -1.23;
})();
console.log(
    (function n() {
        return "okay";
    })()
);
console.log(
    (function n(o, r, t) {
        return 123;
    })()
);
console.log(
    (function (n, o, r) {
        return r;
    })()
);
console.log(
    (function (n, o, r) {
        if (n) return o;
        return r;
    })(1, 2, 3)
);
console.log(
    (function (n, o) {
        return n * o;
    })(2, 3)
);
console.log(
    (function (n, o) {
        return n * o;
    })(2, 3, a(), b())
);
