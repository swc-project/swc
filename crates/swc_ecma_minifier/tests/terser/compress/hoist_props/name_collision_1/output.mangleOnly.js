var b = 1;
var c = 2;
function a() {
    var a = {
        foo: 3,
        bar: 4,
        "b-r": 5,
        "b+r": 6,
        "b!r": 7
    };
    console.log(b, a.foo, a.bar, a["b-r"], a["b+r"], a["b!r"]);
}
a();
