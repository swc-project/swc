//// [nullishCoalescingOperatorInAsyncGenerator.ts]
// https://github.com/microsoft/TypeScript/issues/37686
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function f(a) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _wrap_async_generator(function*(a) {
        var _b;
        let c = (_b = a.b) !== null && _b !== void 0 ? _b : 10;
        while(c){
            yield c--;
        }
    });
    return _f.apply(this, arguments);
}
