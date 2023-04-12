//// [awaitCallExpression5_es5.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(function() {
        var b;
        return _ts_generator(this, function(_state) {
            before();
            b = o.fn(a, a, a);
            after();
            return [
                2
            ];
        });
    });
    return _func.apply(this, arguments);
}
