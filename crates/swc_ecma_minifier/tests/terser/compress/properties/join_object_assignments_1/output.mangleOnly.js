console.log((function() {
    var a = {
        a: 1,
        c: (console.log("c"), "C")
    };
    a.b = 2;
    (a[3] = function() {
        console.log(a);
    }), (a["a"] = /foo/), (a.bar = a);
    return a;
})());
