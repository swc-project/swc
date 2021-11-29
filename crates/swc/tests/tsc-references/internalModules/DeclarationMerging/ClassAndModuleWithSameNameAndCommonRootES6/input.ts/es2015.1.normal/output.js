// @filename: test.ts
//var cl: { x: number; y: number; }
var cl = new X.Y.Point(1, 1);
var cl = X.Y.Point.Origin; // error not expected here same as bug 83996 ?
// @filename: simple.ts
class A {
}
(function(A) {
    A.Instance = new A();
})(A || (A = {
}));
// ensure merging works as expected
var a = A.Instance;
var a = new A();
var a;
