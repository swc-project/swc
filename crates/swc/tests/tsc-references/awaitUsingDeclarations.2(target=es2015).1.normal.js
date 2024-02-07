//// [awaitUsingDeclarations.2.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
{
    try {
        var _stack = [];
        var d1 = _using(_stack, {
            [Symbol.asyncDispose] () {
                return _async_to_generator(function*() {})();
            }
        }, true), d2 = _using(_stack, {
            [Symbol.asyncDispose] () {
                return _async_to_generator(function*() {})();
            }
        }, true);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}export { };
