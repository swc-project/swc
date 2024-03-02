//// [asyncGeneratorParameterEvaluation.ts]
// https://github.com/microsoft/TypeScript/issues/40410
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f1(x) {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _wrap_async_generator(function*(x, y = z) {});
    return _f1.apply(this, arguments);
}
function f2(_) {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(function*({ [z]: x }) {});
    return _f2.apply(this, arguments);
}
class Sub extends Super {
    m(x, y = z, _param) {
        var _this = this, _superprop_get_foo = ()=>super.foo;
        return _wrap_async_generator(function*() {
            var w = _extends({}, _object_destructuring_empty(_param));
            _superprop_get_foo().call(_this);
        })();
    }
}
