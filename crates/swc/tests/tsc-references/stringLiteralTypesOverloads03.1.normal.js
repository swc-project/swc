//// [stringLiteralTypesOverloads03.ts]
var hello;
var world;
var helloOrWorld;
function f() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return undefined;
}
var fResult1 = f(hello);
var fResult2 = f(world);
var fResult3 = f(helloOrWorld);
function g() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return undefined;
}
var gResult1 = g(hello);
var gResult2 = g(world);
var gResult3 = g(helloOrWorld);
