//// [usingDeclarations.3.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
try {
    var _stack = [];
    _using(_stack, {
        [Symbol.dispose] () {}
    }), _using(_stack, null), _using(_stack, void 0), _using(_stack, {
        [Symbol.dispose] () {}
    });
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose(_stack, _error, _hasError);
}
