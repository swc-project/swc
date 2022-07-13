// Specialized signatures must be a subtype of a non-specialized signature
// All the below should not be errors
function foo(x) {}
class C {
    foo(x) {}
}
class C2 {
    foo(x) {}
}
class C3 {
    foo(x) {}
}
var a;
var a2;
var a3;
