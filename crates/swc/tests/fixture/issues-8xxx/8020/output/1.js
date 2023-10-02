import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
function baz() {
    return bar;
}
try {
    var _stack = [];
    var foo = _using(_stack, null);
    var bar = 1;
    console.log(baz());
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
