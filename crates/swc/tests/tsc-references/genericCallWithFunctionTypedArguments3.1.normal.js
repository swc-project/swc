//// [genericCallWithFunctionTypedArguments3.ts]
// No inference is made from function typed arguments which have multiple call signatures
var a;
function foo4(cb) {
    var u;
    return u;
}
var r = foo4(a); // T is {} (candidates boolean and string), U is any (candidates any and boolean)
var b;
var r2 = foo4(b); // T is {} (candidates boolean and {}), U is any (candidates any and {})
