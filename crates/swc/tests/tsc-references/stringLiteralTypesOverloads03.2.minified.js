//// [stringLiteralTypesOverloads03.ts]
function f() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
}
var hello, world, helloOrWorld, fResult1 = f(hello), fResult2 = f(world), fResult3 = f(helloOrWorld);
function g() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
}
var gResult1 = g(hello), gResult2 = g(world), gResult3 = g(helloOrWorld);
