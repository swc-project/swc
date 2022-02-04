// Type parameters are in scope in their own and other type parameter lists
// Nested local functions
function foo(x, y) {
    function bar() {
        function baz(a, b) {
            x = y;
            return y;
        }
    }
}
function foo2(x, y) {
    function bar() {
        function baz(a, b) {
            x = y;
            return y;
        }
    }
}
var f = function(x, y) {
    function bar() {
        var g = function(a, b) {
            x = y;
            return y;
        };
    }
};
var f2 = function(x, y) {
    function bar() {
        var g = function baz(a, b) {
            x = y;
            return y;
        };
    }
};
var f3 = (x, y)=>{
    function bar() {
        var g = (a, b)=>{
            x = y;
            return y;
        };
    }
};
var f4 = (x, y)=>{
    function bar() {
        var g = (a, b)=>{
            x = y;
            return y;
        };
    }
};
