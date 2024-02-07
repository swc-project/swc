//// [awaitUsingDeclarations.3.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
{
    try {
        var _stack = [];
        var d1 = _using(_stack, {
            async [Symbol.asyncDispose] () {}
        }, true), d2 = _using(_stack, null, true), d3 = _using(_stack, undefined, true), d4 = _using(_stack, {
            [Symbol.dispose] () {}
        }, true);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}export { };
