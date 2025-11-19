//// [nullishCoalescingOperatorInAsyncGenerator.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
// https://github.com/microsoft/TypeScript/issues/37686
function f(a) {
    return _wrap_async_generator(function*() {
        var _a_b;
        let c = (_a_b = a.b) !== null && _a_b !== void 0 ? _a_b : 10;
        while(c){
            yield c--;
        }
    })();
}
