// String literal types are only valid in overload signatures
function foo(x) {}
class C {
    foo(x) {}
}
var a;
var b = {
    foo (x) {},
    foo (x) {}
};
