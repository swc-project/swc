//// [nullishCoalescingOperatorInAsyncGenerator.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f(a) {
    return _f.apply(this, arguments);
}
function _f() {
    return (_f = _wrap_async_generator(function(a) {
        var _b, c;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    c = null !== (_b = a.b) && void 0 !== _b ? _b : 10, _state.label = 1;
                case 1:
                    if (!c) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        c--
                    ];
                case 2:
                    return _state.sent(), [
                        3,
                        1
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
