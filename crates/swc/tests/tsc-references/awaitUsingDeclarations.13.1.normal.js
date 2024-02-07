//// [awaitUsingDeclarations.13.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
function f() {
    try {
        var _stack = [];
        var x = _using(_stack, null, true);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}
try {
    var _stack = [];
    var x = _using(_stack, null, true);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    await _dispose(_stack, _error, _hasError);
}
