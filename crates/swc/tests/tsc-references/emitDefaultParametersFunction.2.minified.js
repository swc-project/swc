//// [emitDefaultParametersFunction.ts]
function foo(x) {
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
function baz(x) {
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    for(var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)rest[_key - 2] = arguments[_key];
}
function bar() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}
function bar1() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    for(var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
}
