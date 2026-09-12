//// [asyncGeneratorParameterEvaluation.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
class Sub extends Super {
    m(_0, _1) {
        var _this = this, _superprop_get_foo = ()=>super.foo;
        return _wrap_async_generator(function*(x, _1, _2) {
            let [y = z, ..._rest] = [
                _1,
                _2
            ], [_ref1] = _rest, {} = _ref1;
            _extends({}, _ref1), _superprop_get_foo().call(_this);
        }).apply(this, arguments);
    }
}
