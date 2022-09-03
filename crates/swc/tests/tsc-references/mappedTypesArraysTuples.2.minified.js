//// [mappedTypesArraysTuples.ts]
var y10 = unboxify(x10), y11 = unboxify(x11), y12 = unboxify(x12), y20 = nonpartial(x20), y21 = nonpartial(x21), y22 = nonpartial(x22);
function f1(a, b, c, d) {
    all(a), all(a, b), all(a, b, c), all(a, b, c, d);
}
function f2(a) {
    a.pop(), a.concat(a);
}
function acceptMappedArray(arr) {
    acceptArray(mapArray(arr));
}
