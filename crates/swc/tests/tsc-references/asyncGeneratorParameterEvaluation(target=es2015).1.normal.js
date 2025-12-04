//// [asyncGeneratorParameterEvaluation.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
// https://github.com/microsoft/TypeScript/issues/40410
function f1(_0) {
    return _wrap_async_generator(function*(x, y = z) {}).apply(this, arguments);
}
function f2(_0) {
    return _wrap_async_generator(function*({ [z]: x }) {}).apply(this, arguments);
}
class Sub extends Super {
    m(x, _1, _2) {
        var _this = this, _superprop_get_foo = ()=>super.foo;
        return _wrap_async_generator(function*() {
            let _ref = [
                _1,
                _2
            ], [y = z, _ref1] = _ref, {} = _ref1, w = _extends({}, _ref1);
            _superprop_get_foo().call(_this);
        })();
    }
}
