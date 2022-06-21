var value;
// identifiers: variable and parameter
var x1;
x1 = Math.pow(x1, value);
function fn1(x2) {
    x2 = Math.pow(x2, value);
}
// property accesses
var x3;
var ref = x3.a;
x3.a = Math.pow(ref, value);
var ref1 = x3["a"];
x3["a"] = Math.pow(ref1, value);
var // parentheses, the contained expression is reference
ref2 = (x1);
(x1) = Math.pow(ref2, value);
function fn2(x4) {
    var ref = x4;
    x4 = Math.pow(ref, value);
}
var ref3 = x3.a;
x3.a = Math.pow(ref3, value);
var ref4 = x3["a"];
x3["a"] = Math.pow(ref4, value);
