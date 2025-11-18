//// [nullishCoalescingOperatorInAsyncGenerator.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
// https://github.com/microsoft/TypeScript/issues/37686
function f(a) {
    return _wrap_async_generator(function() {
        var _a_b, c;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    c = (_a_b = a.b) !== null && _a_b !== void 0 ? _a_b : 10;
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
    })();
}
