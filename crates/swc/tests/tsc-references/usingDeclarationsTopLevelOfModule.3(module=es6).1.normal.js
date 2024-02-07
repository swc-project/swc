//// [usingDeclarationsTopLevelOfModule.3.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
export { y };
function f() {
    console.log(y, z);
}
try {
    var _stack = [];
    var z = _using(_stack, {
        [Symbol.dispose] () {}
    });
    if (false) {
        var y = 1;
    }
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
