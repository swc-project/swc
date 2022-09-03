//// [genericCallWithConstructorTypedArguments5.ts]
function foo(arg) {
    return new arg.cb(null);
}
var arg, arg2, arg3, arg4, arg5, r = foo(arg), r2 = foo(arg2), r3 = foo(arg3);
function foo2(arg) {
    return new arg.cb(null, null);
}
var r4 = foo(arg), r6 = foo(arg4), r7 = foo(arg5);
