//// [callChainWithSuper.ts]
class Base {
    method() {}
}
class Derived extends Base {
    method1() {
        return super.method?.();
    }
    method2() {
        return super.method?.();
    }
}
