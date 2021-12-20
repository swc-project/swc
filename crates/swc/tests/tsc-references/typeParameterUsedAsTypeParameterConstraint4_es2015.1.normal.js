// Type parameters are in scope in their own and other type parameter lists
// Some negative cases
class C {
    foo(x) {
        var r;
        return x;
    }
}
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
var f3 = (x, y)=>{
    function bar(r, s) {
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
