//// [nullishCoalescingOperatorInAsyncGenerator.ts]
// https://github.com/microsoft/TypeScript/issues/37686
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f(a) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _wrap_async_generator(function*(a) {
        var _a_b;
        let c = (_a_b = a.b) !== null && _a_b !== void 0 ? _a_b : 10;
        while(c){
            yield c--;
        }
    });
    return _f.apply(this, arguments);
}
