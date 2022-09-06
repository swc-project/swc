var o = [0, 1, NaN, Infinity, null, undefined, true, false, "", "foo", /foo/];
o.forEach(function (n) {
    o.forEach(function (o) {
        console.log(+(n * o), +(n / o), +(n % o), -(n * o), -(n / o), -(n % o));
    });
});
