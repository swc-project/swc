var b = 1;
var o = 2;
function r() {
    var r = {
        foo: 3,
        bar: 4,
        "b-r": 5,
        "b+r": 6,
        "b!r": 7
    };
    console.log(b, r.foo, r.bar, r["b-r"], r["b+r"], r["b!r"]);
}
r();
