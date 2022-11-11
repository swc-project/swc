//// [thisMethodCall.ts]
class C {
    method() {}
    other() {
        var _this, _this_method;
        (_this_method = (_this = this).method) === null || _this_method === void 0 ? void 0 : _this_method.call(_this);
    }
}
