// @target: es5
function f() {
    var ref = {
        arguments: arguments
    }, args = ref.arguments;
    if (Math.random()) {
        var _arguments = arguments;
        return function() {
            return _arguments;
        };
    }
}
