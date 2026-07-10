class A {
    m() {
        return B;
    }
}
class B extends A {
    @dec
    m() {
        return A;
    }
}
