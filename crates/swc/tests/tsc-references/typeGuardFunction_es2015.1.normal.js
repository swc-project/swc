class A {
}
class B {
}
class C extends A {
}
var a;
var b;
// Basic
if (isC(a)) {
    a.propC;
}
// Sub type
var subType;
if (isA(subType)) {
    subType.propC;
}
// Union type
var union;
if (isA(union)) {
    union.propA;
}
if (isC_multipleParams(a, 0)) {
    a.propC;
}
// Methods
var obj;
class D {
    method1(p1) {
        return true;
    }
}
// Arrow function
let f1 = (p1)=>false;
// Function expressions
f2(function(p1) {
    return true;
});
acceptingBoolean(isA(a));
acceptingTypeGuardFunction(isA);
// Binary expressions
let union2;
let union3 = isA(union2) || union2;
