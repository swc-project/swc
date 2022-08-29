//// [emitArrowFunction.ts]
var f1 = function() {};
var f2 = function(x, y) {};
var f3 = function(x, y) {
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
};
var f4 = function(x, y) {
    var z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 10;
};
function foo(func) {}
foo(function() {
    return true;
});
foo(function() {
    return false;
});
