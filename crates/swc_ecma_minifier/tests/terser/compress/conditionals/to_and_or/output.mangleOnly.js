var a = [
    0,
    null,
    true,
    "foo",
    false,
    -1 / 0,
    void 0
];
a.forEach(function(b) {
    a.forEach(function(c) {
        a.forEach(function(a) {
            console.log(b ? c || a : a);
        });
    });
});
