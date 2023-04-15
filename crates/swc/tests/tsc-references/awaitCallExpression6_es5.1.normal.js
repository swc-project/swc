//// [awaitCallExpression6_es5.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(function() {
        var b, _;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    before();
                    _ = o.fn;
                    return [
                        4,
                        p
                    ];
                case 1:
                    b = _.apply(o, [
                        _state.sent(),
                        a,
                        a
                    ]);
                    after();
                    return [
                        2
                    ];
            }
        });
    });
    return _func.apply(this, arguments);
}
