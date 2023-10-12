var _arguments = arguments;
function fn() {
    var _arguments = arguments;
    var foo = function() {
        return _arguments;
    };
}
var bar = function() {
    return _arguments;
};
var baz = function() {
    return function() {
        return _arguments;
    };
};
