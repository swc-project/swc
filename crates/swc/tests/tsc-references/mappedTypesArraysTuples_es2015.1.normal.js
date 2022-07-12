// @strict: true
// @declaration: true
let y10 = unboxify(x10);
let y11 = unboxify(x11);
let y12 = unboxify(x12);
let y20 = nonpartial(x20);
let y21 = nonpartial(x21);
let y22 = nonpartial(x22);
function f1(a, b, c, d) {
    let x1 = all(a);
    let x2 = all(a, b);
    let x3 = all(a, b, c);
    let x4 = all(a, b, c, d);
}
function f2(a) {
    let x = a.pop();
    let y = a.concat(a);
}
function acceptMappedArray(arr) {
    acceptArray(mapArray(arr));
}
 // string | number | boolean
