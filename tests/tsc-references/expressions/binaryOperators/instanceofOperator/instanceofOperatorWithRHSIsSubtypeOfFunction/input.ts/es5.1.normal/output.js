function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var x;
var f1;
var f2;
var f3;
var f4;
var r1 = _instanceof(x, f1);
var r2 = _instanceof(x, f2);
var r3 = _instanceof(x, f3);
var r4 = _instanceof(x, f4);
var r5 = _instanceof(x, null);
var r6 = _instanceof(x, undefined);
