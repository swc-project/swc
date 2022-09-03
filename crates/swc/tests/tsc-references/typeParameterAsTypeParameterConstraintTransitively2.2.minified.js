//// [typeParameterAsTypeParameterConstraintTransitively2.ts]
var a, b, c;
function foo(x, y, z) {
    return z;
}
function foo2(x, y, z) {
    return z;
}
foo(1, 2, ""), foo({
    x: 1
}, {
    x: 1,
    y: ""
}, {
    x: 2,
    y: 2,
    z: !0
}), foo(a, b, a), foo(a, {
    foo: 1,
    bar: "",
    hm: !0
}, b), foo(function(x, y) {}, function(x, y) {}, function() {}), foo(b, a, c), foo(c, c, a);
