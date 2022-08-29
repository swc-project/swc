//// [thisMethodCall.ts]
class C {
    method() {}
    other() {
        var _obj, ref;
        (ref = (_obj = this).method) === null || ref === void 0 ? void 0 : ref.call(_obj);
    }
}
