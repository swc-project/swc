//// [compoundAssignmentLHSIsReference.ts]
var value, x1, x3;
x1 *= value, x1 += value, x3.a *= value, x3.a += value, x3.a *= value, x3.a += value, // parentheses, the contained expression is reference
x1 *= value, x1 += value, x3.a *= value, x3.a += value, x3.a *= value, x3.a += value;
