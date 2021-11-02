// conditional expressions return the best common type of the branches plus contextual type (using the first candidate if multiple BCTs exist)
// these are errors
class Base {
}
class Derived extends Base {
}
class Derived2 extends Base {
}
var base;
var derived;
var derived2;
var r2 = true ? 1 : '';
var r9 = true ? derived : derived2;
function foo(t, u) {
    return true ? t : u;
}
function foo2(t, u) {
    return true ? t : u; // Ok because BCT(T, U) = U
}
function foo3(t, u) {
    return true ? t : u;
}
