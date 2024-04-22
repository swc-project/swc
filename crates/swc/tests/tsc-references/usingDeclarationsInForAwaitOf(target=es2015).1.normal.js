//// [usingDeclarationsInForAwaitOf.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(function*() {
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator([
                    {
                        [Symbol.dispose] () {}
                    },
                    null,
                    undefined
                ]), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const d1 = _value;
                    try {
                        var _usingCtx = _using_ctx();
                        {}
                    } catch (_) {
                        _usingCtx.e = _;
                    } finally{
                        _usingCtx.d();
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _await_async_generator(_iterator.return());
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    });
    return _main.apply(this, arguments);
}
