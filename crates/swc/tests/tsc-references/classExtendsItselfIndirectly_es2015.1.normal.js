class C extends E {
} // error
class D extends C {
}
class E extends D {
}
class C2 extends E2 {
} // error
class D2 extends C2 {
}
class E2 extends D2 {
}
