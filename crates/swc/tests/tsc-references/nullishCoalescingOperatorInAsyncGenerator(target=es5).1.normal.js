//// [nullishCoalescingOperatorInAsyncGenerator.ts]
// https://github.com/microsoft/TypeScript/issues/37686
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f(a) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _wrap_async_generator(function(a) {
        var _b, c;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    c = (_b = a.b) !== null && _b !== void 0 ? _b : 10;
                    _state.label = 1;
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
                    _state.sent();
                    return [
                        3,
                        1
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return _f.apply(this, arguments);
}
