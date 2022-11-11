//// [emitArrowFunctionWhenUsingArguments18.ts]
function f() {
    var _arguments = arguments;
    var _ref = {
        arguments: arguments
    }, args = _ref.arguments;
    if (Math.random()) {
        return function() {
            return _arguments;
        };
    }
}
