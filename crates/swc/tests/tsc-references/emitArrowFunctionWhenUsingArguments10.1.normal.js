//// [emitArrowFunctionWhenUsingArguments10.ts]
function f() {
    var _arguments = arguments;
    var _arguments1 = 10;
    var a = function() {
        return function() {
            return _arguments;
        };
    };
}
