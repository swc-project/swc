class C {
    cycle() {
        return D;
    }
}
class D {
    cycle() {
        return C;
    }
}
sideEffectWith(C);
