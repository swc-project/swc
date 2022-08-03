var o = [
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
o.forEach(function(f) {
    o.forEach(function(o) {
        console.log(+(f * o), +(f / o), +(f % o), -(f * o), -(f / o), -(f % o));
    });
});
