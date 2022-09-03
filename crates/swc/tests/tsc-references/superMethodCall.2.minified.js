//// [superMethodCall.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
class Base {
    method() {}
}
class Derived extends Base {
    method() {
        var ref;
        return null === (ref = super.method) || void 0 === ref ? void 0 : ref.call(this);
    }
    asyncMethod() {
        var _this = this, _superprop_get_method = ()=>super.method;
        return _async_to_generator(function*() {
            var ref;
            return null === (ref = _superprop_get_method()) || void 0 === ref ? void 0 : ref.call(_this);
        })();
    }
}
