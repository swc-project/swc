// conditional expressions return the best common type of the branches plus contextual type (using the first candidate if multiple BCTs exist)
// no errors expected here
var a;
var b;
class Base {
}
class Derived extends Base {
}
class Derived2 extends Base {
}
var base;
var derived;
var derived2;
var r = true ? 1 : 2;
var r3 = true ? 1 : {
};
var r4 = true ? a : b; // typeof a
var r5 = true ? b : a; // typeof b
var r6 = true ? (x)=>{
} : (x)=>{
}; // returns number => void
var r7 = true ? (x)=>{
} : (x)=>{
};
var r8 = true ? (x)=>{
} : (x)=>{
}; // returns Object => void
var r10 = true ? derived : derived2; // no error since we use the contextual type in BCT
var r11 = true ? base : derived2;
function foo5(t, u) {
    return true ? t : u; // BCT is Object
}
