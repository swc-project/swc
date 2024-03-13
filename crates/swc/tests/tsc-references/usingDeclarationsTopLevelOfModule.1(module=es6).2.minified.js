//// [usingDeclarationsTopLevelOfModule.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
try {
    var _x, _w, _stack = [];
    _x = 1;
    var z = _using(_stack, {
        [Symbol.dispose] () {}
    }), y = 2;
    _w = 3;
    var _default = 4;
    console.log(3, 1, y, z);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose(_stack, _error, _hasError);
}
export { y, _default as default, _x as x, _w as w };
