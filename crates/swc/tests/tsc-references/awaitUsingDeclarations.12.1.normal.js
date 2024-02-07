//// [awaitUsingDeclarations.12.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
async function f() {
    try {
        var _stack = [];
        var x = _using(_stack, {}, true);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}
