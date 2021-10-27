// String literal types are only valid in overload signatures
function foo(x) {
}
var f = function foo(x) {
};
var f2 = (x, y)=>{
};
class C {
    foo(x) {
    }
}
var a;
var b = {
    foo (x) {
    },
    a: function foo(x, y) {
    },
    b: (x)=>{
    }
};
