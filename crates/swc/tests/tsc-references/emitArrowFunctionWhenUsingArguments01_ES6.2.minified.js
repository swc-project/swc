//// [emitArrowFunctionWhenUsingArguments01_ES6.ts]
var a = ()=>{
    var arg = arguments[0];
}, b = function() {};
function baz() {}
function foo(inputFunc) {}
function bar() {
    arguments[0];
}
foo(()=>{
    var arg = arguments[0];
});
