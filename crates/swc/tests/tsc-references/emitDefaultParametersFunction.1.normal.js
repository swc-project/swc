//// [emitDefaultParametersFunction.ts]
function foo(x) {
    var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10;
}
function baz(x) {
    var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
}
function bar() {
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
}
function bar1() {
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
}
