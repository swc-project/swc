var arg, arg2, arg3, arg4, arg5;
function foo(arg) {
    return new arg.cb(null);
}
foo(arg), foo(arg2), foo(arg3), foo(arg), foo(arg4), foo(arg5);
