//// [awaitCallExpression1_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(function() {
        var b;
        return _ts_generator(this, function(_state) {
            before();
            b = fn(a, a, a);
            after();
            return [
                2
            ];
        });
    });
    return _func.apply(this, arguments);
}
