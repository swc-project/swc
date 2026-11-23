//// [genericCallWithConstructorTypedArguments5.ts]
function foo(arg) {
    return new arg.cb(null);
}
foo(void 0), foo(void 0), foo(void 0), foo(void 0), foo(void 0), foo(void 0);
