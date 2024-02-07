//// [usingDeclarationsInForOf.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
for (let d1 of [
    {
        [Symbol.dispose] () {}
    },
    null,
    void 0
])try {
    var _stack = [];
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose(_stack, _error, _hasError);
}
