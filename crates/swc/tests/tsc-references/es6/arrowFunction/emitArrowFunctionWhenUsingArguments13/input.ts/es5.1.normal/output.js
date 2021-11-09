// @target: es5
function f() {
    var _arguments = 10;
    var a = function(arguments) {
        return function() {
            return _arguments;
        };
    };
}
