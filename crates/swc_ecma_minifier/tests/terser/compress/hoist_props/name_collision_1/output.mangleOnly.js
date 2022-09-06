var r = 1;
var b = 2;
function o() {
    var b = { foo: 3, bar: 4, "b-r": 5, "b+r": 6, "b!r": 7 };
    console.log(r, b.foo, b.bar, b["b-r"], b["b+r"], b["b!r"]);
}
o();
