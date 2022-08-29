//// [mappedTypesArraysTuples.ts]
var y10 = unboxify(x10);
var y11 = unboxify(x11);
var y12 = unboxify(x12);
var y20 = nonpartial(x20);
var y21 = nonpartial(x21);
var y22 = nonpartial(x22);
function f1(a, b, c, d) {
    var x1 = all(a);
    var x2 = all(a, b);
    var x3 = all(a, b, c);
    var x4 = all(a, b, c, d);
}
function f2(a) {
    var x = a.pop();
    var y = a.concat(a);
}
function acceptMappedArray(arr) {
    acceptArray(mapArray(arr));
}
 // string | number | boolean
