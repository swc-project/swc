//// [stringLiteralTypesOverloads03.ts]
function f() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
}
function g() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
}
f(void 0), f(void 0), f(void 0), g(void 0), g(void 0), g(void 0);
