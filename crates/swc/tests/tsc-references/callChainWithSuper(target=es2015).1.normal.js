//// [callChainWithSuper.ts]
// GH#34952
class Base {
    method() {}
}
class Derived extends Base {
    method1() {
        var ref;
        return (ref = super.method) === null || ref === void 0 ? void 0 : ref.call(this);
    }
    method2() {
        var ref;
        return (ref = super["method"]) === null || ref === void 0 ? void 0 : ref.call(this);
    }
}
