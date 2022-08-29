//// [emitArrowFunctionWhenUsingArguments09.ts]
function f(_arguments) {
    var _arguments1 = arguments;
    var a = function() {
        return function() {
            return _arguments1;
        };
    };
}
