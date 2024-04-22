//// [genericCallWithFunctionTypedArguments2.ts]
var i, i2, a;
function foo(x) {
    return new x(null);
}
foo(i), foo(i), foo(i2), foo(a), new i2(1), new a(1), new i(1), new i2(''), new i(null), new a(null), new i2(1), new i2('');
