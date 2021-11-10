(function () {
    return -1.23;
})();
console.log(
    (function foo() {
        return "okay";
    })()
);
console.log(
    (function foo(x, y, z) {
        return 123;
    })()
);
console.log(
    (function (x, y, z) {
        return z;
    })()
);
console.log(
    (function (x, y, z) {
        if (x) return y;
        return z;
    })(1, 2, 3)
);
console.log(
    (function (x, y) {
        return x * y;
    })(2, 3)
);
console.log(
    (function (x, y) {
        return x * y;
    })(2, 3, a(), b())
);
