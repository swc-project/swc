//// [typeParameterExtendsUnionConstraintDistributed.ts]
function f(a) {
    return a;
} // Shouldn't error
function f2(ab) {
    return ab;
} // Also shouldn't error
