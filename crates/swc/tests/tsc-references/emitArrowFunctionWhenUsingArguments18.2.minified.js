//// [emitArrowFunctionWhenUsingArguments18.ts]
function f() {
    var _arguments = arguments, ref = {
        arguments: arguments
    };
    if (ref.arguments, Math.random()) return function() {
        return _arguments;
    };
}
