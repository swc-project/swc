var v = [0, 1, NaN, Infinity, null, undefined, true, false, "", "foo", /foo/];
v.forEach(function (x) {
    v.forEach(function (y) {
        console.log(+(x * y), +(x / y), +(x % y), -(x * y), -(x / y), -(x % y));
    });
});
