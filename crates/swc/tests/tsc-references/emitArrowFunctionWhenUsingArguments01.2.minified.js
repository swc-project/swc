//// [emitArrowFunctionWhenUsingArguments01.ts]
var _arguments = arguments, a = function() {
    _arguments[0];
}, b = function() {};
function baz() {}
function foo(inputFunc) {}
function bar() {
    arguments[0];
}
foo(function() {
    _arguments[0];
});
