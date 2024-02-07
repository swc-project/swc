//// [awaitUsingDeclarations.13.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
try {
    var _stack = [];
    _using(_stack, null, !0);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    await _dispose(_stack, _error, _hasError);
}
