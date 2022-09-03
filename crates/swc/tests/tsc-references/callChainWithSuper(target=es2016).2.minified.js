//// [callChainWithSuper.ts]
class Base {
    method() {}
}
class Derived extends Base {
    method1() {
        var ref;
        return null === (ref = super.method) || void 0 === ref ? void 0 : ref.call(this);
    }
    method2() {
        var ref;
        return null === (ref = super.method) || void 0 === ref ? void 0 : ref.call(this);
    }
}
