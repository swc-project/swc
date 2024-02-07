//// [usingDeclarationsTopLevelOfModule.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
export const x = 1;
export const w = 3;
try {
    var _stack = [], z = _using(_stack, {
        [Symbol.dispose] () {}
    }), y = 2, _default = 4;
    console.log(3, 1, y, z);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose(_stack, _error, _hasError);
}
export { y, _default as default };
