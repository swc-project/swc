//// [nullishCoalescingOperatorInAsyncGenerator.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function f(a) {
    return _f.apply(this, arguments);
}
function _f() {
    return (_f = _wrap_async_generator(function*(a) {
        var _b;
        let c = null !== (_b = a.b) && void 0 !== _b ? _b : 10;
        for(; c;)yield c--;
    })).apply(this, arguments);
}
