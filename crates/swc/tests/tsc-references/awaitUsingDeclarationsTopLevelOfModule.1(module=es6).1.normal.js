//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
export const x = 1;
export { y };
export const w = 3;
export { _default as default };
try {
    var _stack = [];
    var z = _using(_stack, {
        async [Symbol.asyncDispose] () {}
    }, true);
    var y = 2;
    var _default = 4;
    console.log(w, x, y, z);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    await _dispose(_stack, _error, _hasError);
}
