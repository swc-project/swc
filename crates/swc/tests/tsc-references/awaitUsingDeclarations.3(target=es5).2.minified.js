//// [awaitUsingDeclarations.3.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
try {
    var _stack = [];
    _using(_stack, _define_property({}, Symbol.asyncDispose, function() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    }), !0), _using(_stack, null, !0), _using(_stack, void 0, !0), _using(_stack, _define_property({}, Symbol.dispose, function() {}), !0);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    await _dispose(_stack, _error, _hasError);
}
