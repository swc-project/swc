var v = [0, 1, NaN, 1 / 0, null, void 0, true, false, "", "foo", /foo/];
v.forEach(function (x) {
    v.forEach(function (y) {
        console.log(+x * y, +x / y, +x % y, -x * y, -x / y, -x % y);
    });
});
