//// [usingDeclarations.14.ts]
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
try {
    var _stack = [];
    var x = _using(_stack, {});
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
