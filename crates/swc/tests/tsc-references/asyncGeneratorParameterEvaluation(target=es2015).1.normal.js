//// [asyncGeneratorParameterEvaluation.ts]
// https://github.com/microsoft/TypeScript/issues/40410
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f1(_0) {
    return /*#__PURE__*/ _wrap_async_generator(function*(x, y = z) {}).apply(this, arguments);
}
function f2(_0) {
    return /*#__PURE__*/ _wrap_async_generator(function*({ [z]: x }) {}).apply(this, arguments);
}
class Sub extends Super {
    m(_0, _1) {
        var _this = this, _superprop_get_foo = ()=>super.foo;
        return /*#__PURE__*/ _wrap_async_generator(function*(x, y = z, _param) {
            var w = _extends({}, _object_destructuring_empty(_param));
            _superprop_get_foo().call(_this);
        }).apply(this, arguments);
    }
}
