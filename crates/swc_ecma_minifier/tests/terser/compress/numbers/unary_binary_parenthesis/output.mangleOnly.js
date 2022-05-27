var a = [
    0,
    1,
    NaN,
    Infinity,
    null,
    undefined,
    true,
    false,
    "",
    "foo",
    /foo/
];
a.forEach(function(b) {
    a.forEach(function(a) {
        console.log(+(b * a), +(b / a), +(b % a), -(b * a), -(b / a), -(b % a));
    });
});
