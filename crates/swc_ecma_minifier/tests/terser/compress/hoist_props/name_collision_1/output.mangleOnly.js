var r = 1;
var o = 2;
function a() {
    var o = {
        foo: 3,
        bar: 4,
        "b-r": 5,
        "b+r": 6,
        "b!r": 7
    };
    console.log(r, o.foo, o.bar, o["b-r"], o["b+r"], o["b!r"]);
}
a();
