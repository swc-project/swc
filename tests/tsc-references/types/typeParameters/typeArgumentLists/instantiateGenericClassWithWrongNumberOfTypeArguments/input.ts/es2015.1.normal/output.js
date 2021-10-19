// it is always an error to provide a type argument list whose count does not match the type parameter list
// both of these attempts to construct a type is an error
class C {
}
var c = new C();
class D {
}
// BUG 794238
var d = new D();
