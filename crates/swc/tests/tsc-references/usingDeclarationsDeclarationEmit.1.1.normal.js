//// [usingDeclarationsDeclarationEmit.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
export { r1 };
export { r2 };
try {
    var _stack = [];
    var r1 = _using(_stack, {
        [Symbol.dispose] () {}
    });
    var r2 = _using(_stack, {
        async [Symbol.asyncDispose] () {}
    }, true);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    await _dispose(_stack, _error, _hasError);
}
