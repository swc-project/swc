// @filename: test.ts
//var cl: { x: number; y: number; }
var cl = new X.Y.Point(1, 1);
var cl = X.Y.Point.Origin; // error not expected here same as bug 83996 ?
// @filename: simple.ts
class A1 {
}
(function(A) {
    A.Instance = new A1();
})(A1 || (A1 = {
}));
// ensure merging works as expected
var a = A1.Instance;
var a = new A1();
var a;
