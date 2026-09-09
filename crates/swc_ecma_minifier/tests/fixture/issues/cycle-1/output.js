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
class ExtendsA1 extends sideEffectWith(A) {
}
class ExtendsA2 extends sideEffectWith(A) {
}
