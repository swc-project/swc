//// [typeParameterUsedAsTypeParameterConstraint2.ts]
// Type parameters are in scope in their own and other type parameter lists
// Nested local functions
function foo(x, y) {
    var bar = function bar() {
        function baz(a, b) {
            x = y;
            return y;
        }
    };
}
function foo2(x, y) {
    var bar = function bar() {
        function baz(a, b) {
            x = y;
            return y;
        }
    };
}
var f = function f(x, y) {
    var bar = function bar() {
        var g = function g(a, b) {
            x = y;
            return y;
        };
    };
};
var f2 = function f2(x, y) {
    var bar = function bar() {
        var g = function baz(a, b) {
            x = y;
            return y;
        };
    };
};
var f3 = function(x, y) {
    var bar = function bar() {
        var g = function(a, b) {
            x = y;
            return y;
        };
    };
};
var f4 = function(x, y) {
    var bar = function bar() {
        var g = function(a, b) {
            x = y;
            return y;
        };
    };
};
