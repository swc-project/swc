// @target: es5
function f() {
    var _arguments = arguments;
    var ref = {
        arguments: arguments
    }, args = ref.arguments;
    if (Math.random()) {
        return function() {
            return _arguments;
        };
    }
}
