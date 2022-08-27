//// [a.js]
var /*1*/ x = function foo() {};
x.a = function bar() {};
//// [b.ts]
var x = function() {
    return 1;
}();
