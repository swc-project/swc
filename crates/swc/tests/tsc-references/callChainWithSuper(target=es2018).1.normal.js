//// [callChainWithSuper.ts]
// GH#34952
class Base {
    method() {}
}
class Derived extends Base {
    method1() {
        var _super_method;
        return (_super_method = super.method) === null || _super_method === void 0 ? void 0 : _super_method.call(this);
    }
    method2() {
        var _super_method;
        return (_super_method = super["method"]) === null || _super_method === void 0 ? void 0 : _super_method.call(this);
    }
}
