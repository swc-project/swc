var o = [
    0,
    null,
    true,
    "foo",
    false,
    -1 / 0,
    void 0
];
o.forEach(function(f) {
    o.forEach(function(n) {
        o.forEach(function(o) {
            console.log(f ? n || o : o);
        });
    });
});
