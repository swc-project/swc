//// [compoundAssignmentLHSIsReference.ts]
var value, x1, x3;
function fn1(x2) {
    x2 *= value, x2 += value;
}
function fn2(x4) {
    x4 *= value, x4 += value;
}
x1 *= value, x1 += value, x3.a *= value, x3.a += value, x3.a *= value, x3.a += value, x1 *= value, x1 += value, x3.a *= value, x3.a += value, x3.a *= value, x3.a += value;
