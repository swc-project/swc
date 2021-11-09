// checking whether other types are subtypes of type parameters with constraints
class C3 {
}
class D1 extends C3 {
}
class D2 extends C3 {
}
class D3 extends C3 {
}
class D4 extends C3 {
}
// V > U > T
// test if T is subtype of T, U, V
// should all work
class D5 extends C3 {
}
class D6 extends C3 {
}
class D7 extends C3 {
}
// test if U is a subtype of T, U, V
// only a subtype of V and itself
class D8 extends C3 {
}
class D9 extends C3 {
}
class D10 extends C3 {
}
// test if V is a subtype of T, U, V
// only a subtype of itself
class D11 extends C3 {
}
class D12 extends C3 {
}
class D13 extends C3 {
}
// Date > V > U > T
// test if T is subtype of T, U, V, Date
// should all work
class D14 extends C3 {
}
class D15 extends C3 {
}
class D16 extends C3 {
}
class D17 extends C3 {
}
// test if U is a subtype of T, U, V, Date
// only a subtype of V, Date and itself
class D18 extends C3 {
}
class D19 extends C3 {
}
class D20 extends C3 {
}
class D21 extends C3 {
}
// test if V is a subtype of T, U, V, Date
// only a subtype of itself and Date
class D22 extends C3 {
}
class D23 extends C3 {
}
class D24 extends C3 {
}
class D25 extends C3 {
}
// test if Date is a subtype of T, U, V, Date
// only a subtype of itself
class D26 extends C3 {
}
class D27 extends C3 {
}
class D28 extends C3 {
}
class D29 extends C3 {
}
