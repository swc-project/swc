class A {
    cycle() {
        return B;
    }
}
class B {
    cycle() {
        return A;
    }
}
sideEffectWith(A), sideEffectWith(A);
