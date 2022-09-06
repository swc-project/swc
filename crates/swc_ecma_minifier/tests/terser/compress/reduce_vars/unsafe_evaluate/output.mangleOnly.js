function o() {
    var o = { b: 1 };
    console.log(o.b + 3);
}
function c() {
    var o = { b: { c: 1 }, d: 2 };
    console.log(o.b + 3, o.d + 4, o.b.c + 5, o.d.c + 6);
}
