console.log((function() {
    var o = {
        a: 1,
        c: (console.log("c"), "C")
    };
    o.b = 2;
    (o[3] = function() {
        console.log(o);
    }), (o["a"] = /foo/), (o.bar = o);
    return o;
})());
