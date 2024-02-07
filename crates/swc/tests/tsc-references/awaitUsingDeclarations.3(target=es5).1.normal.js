//// [awaitUsingDeclarations.3.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
{
    try {
        var _stack = [];
        var d1 = _using(_stack, _define_property({}, Symbol.asyncDispose, function() {
            return _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    return [
                        2
                    ];
                });
            })();
        }), true), d2 = _using(_stack, null, true), d3 = _using(_stack, undefined, true), d4 = _using(_stack, _define_property({}, Symbol.dispose, function() {}), true);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}export { };
