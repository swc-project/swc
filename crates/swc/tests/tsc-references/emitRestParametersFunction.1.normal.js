//// [emitRestParametersFunction.ts]
function bar() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
}
function foo(x, y) {
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
}
