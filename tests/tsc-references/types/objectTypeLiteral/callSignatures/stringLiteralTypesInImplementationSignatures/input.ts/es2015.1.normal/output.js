// String literal types are only valid in overload signatures
function foo(x) {
}
var f = function foo(x) {
};
var f2 = (x, y)=>{
};
class C {
    foo(x2) {
    }
}
var a;
var b = {
    foo (x1) {
    },
    a: function foo(x, y) {
    },
    b: (x)=>{
    }
};
