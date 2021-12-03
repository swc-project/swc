class C1 {
}
class C2 extends C1 {
}
var c11;
c1; // Should succeed (private x originates in the same declaration)
class C3 {
}
class C4 extends C3 {
}
var c31;
c3; // Should fail (private x originates in the same declaration, but different types)
