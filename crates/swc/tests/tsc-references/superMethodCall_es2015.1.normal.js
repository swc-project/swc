import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @strict: true
// @target: ES6
class Base {
    method() {}
}
class Derived extends Base {
    method() {
        var ref;
        return (ref = super.method) === null || ref === void 0 ? void 0 : ref.call(this);
    }
    asyncMethod() {
        var _this = this, _superprop_get_method = ()=>super.method;
        return _async_to_generator(function*() {
            var ref;
            return (ref = _superprop_get_method()) === null || ref === void 0 ? void 0 : ref.call(_this);
        })();
    }
}
