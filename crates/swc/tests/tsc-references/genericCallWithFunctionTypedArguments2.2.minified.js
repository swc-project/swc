//// [genericCallWithFunctionTypedArguments2.ts]
function foo(x) {
    return new x(null);
}
foo(void 0), foo(void 0), foo(void 0), foo(void 0), new (void 0)(1), new (void 0)(1), new (void 0)(1), new (void 0)(''), new (void 0)(null), new (void 0)(null), new (void 0)(1), new (void 0)('');
