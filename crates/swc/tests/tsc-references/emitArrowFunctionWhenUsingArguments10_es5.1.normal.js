// @target: es5
function f() {
    var _arguments1 = arguments;
    var _arguments = 10;
    var a = function() {
        return function() {
            return _arguments1;
        };
    };
}
