//// [usingDeclarationsDeclarationEmit.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
try {
    var _stack = [], r1 = _using(_stack, {
        [Symbol.dispose] () {}
    }), r2 = _using(_stack, {
        async [Symbol.asyncDispose] () {}
    }, !0);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    await _dispose(_stack, _error, _hasError);
}
export { r1, r2 };
