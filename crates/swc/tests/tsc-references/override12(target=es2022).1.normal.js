//// [override12.ts]
class A {
    m1() {
        return 0;
    }
    m2() {
        return 0;
    }
    m3() {}
}
class B extends A {
    m1() {
        return 10;
    }
    m2() {
        return 30;
    }
    m3() {}
}
