//// [usingDeclarationsTopLevelOfModule.1.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
var _x;
export { y };
var _w;
export { _default as default };
try {
    var _stack = [];
    const x = 1;
    _x = x;
    var z = _using(_stack, {
        [Symbol.dispose] () {}
    });
    var y = 2;
    const w = 3;
    _w = w;
    var _default = 4;
    console.log(w, x, y, z);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
export { _x as x };
export { _w as w };
