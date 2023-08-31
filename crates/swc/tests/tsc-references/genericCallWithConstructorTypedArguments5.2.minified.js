//// [genericCallWithConstructorTypedArguments5.ts]
// Generic call with parameter of object type with member of function type of n args passed object whose associated member is call signature with n+1 args
var arg, arg2, arg3, arg4, arg5;
function foo(arg) {
    return new arg.cb(null);
}
foo(arg), foo(arg2), foo(arg3), foo(arg), foo(arg4), foo(arg5);
 // string
