var a = 1;
var b = 2;
function c() {
    var b = {
        foo: 3,
        bar: 4,
        "b-r": 5,
        "b+r": 6,
        "b!r": 7
    };
    console.log(a, b.foo, b.bar, b["b-r"], b["b+r"], b["b!r"]);
}
c();
