// @target: es5
function foo(x, param) {
    var y = param === void 0 ? 10 : param;
}
function baz(x, param) {
    var y = param === void 0 ? 5 : param;
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
}
function bar(param) {
    var y = param === void 0 ? 10 : param;
}
function bar1(param) {
    var y = param === void 0 ? 10 : param;
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
}
