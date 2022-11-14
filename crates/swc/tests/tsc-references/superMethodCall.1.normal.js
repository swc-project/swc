//// [superMethodCall.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
class Base {
    method() {}
}
class Derived extends Base {
    method() {
        var _super_method;
        return (_super_method = super.method) === null || _super_method === void 0 ? void 0 : _super_method.call(this);
    }
    asyncMethod() {
        var _this = this, _superprop_get_method = ()=>super.method;
        return _async_to_generator(function*() {
            var _super_method;
            return (_super_method = _superprop_get_method()) === null || _super_method === void 0 ? void 0 : _super_method.call(_this);
        })();
    }
}
