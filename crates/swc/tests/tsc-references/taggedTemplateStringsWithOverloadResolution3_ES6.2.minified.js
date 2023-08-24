//// [taggedTemplateStringsWithOverloadResolution3_ES6.ts]
// Ambiguous call picks the first overload in declaration order
function fn1() {
    return null;
}
function fn2() {}
fn1`${void 0}`, // No candidate overloads found
fn1`${{}}`;
var d1 = fn2`${0}${void 0}`, d2 = fn2`${0}${void 0}`; // contextually typed
function fn3() {
    return null;
}
function fn4() {}
function fn5() {}
d1.foo(), d2(), // Generic and non-generic overload where generic overload is the only candidate
fn2`${0}${''}`, // Generic and non-generic overload where non-generic overload is the only candidate
fn2`${''}${0}`, fn3`${3}`, fn3`${''}${3}${''}`, fn3`${5}${5}${5}`, fn3`${4}`, fn3`${''}${''}${''}`, fn3`${''}${''}${3}`, // Generic overloads with differing arity tagging with argument count that doesn't match any overload
fn3``, // Generic overloads with constraints tagged with types that satisfy the constraints
fn4`${''}${3}`, fn4`${3}${''}`, fn4`${3}${void 0}`, fn4`${''}${null}`, // Generic overloads with constraints called with type arguments that do not satisfy the constraints
fn4`${null}${null}`, // Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
fn4`${!0}${null}`, fn4`${null}${!0}`, fn5`${(n)=>n.toFixed()}`, fn5`${(n)=>n.substr(0)}`;
