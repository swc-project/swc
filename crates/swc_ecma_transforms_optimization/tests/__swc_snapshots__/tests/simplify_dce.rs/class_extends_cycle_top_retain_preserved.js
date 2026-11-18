class A {
    m() {
        return B;
    }
}
class B extends A {
    m() {
        return A;
    }
}
