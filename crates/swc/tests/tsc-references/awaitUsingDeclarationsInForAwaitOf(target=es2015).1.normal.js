//// [awaitUsingDeclarationsInForAwaitOf.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
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
                        [Symbol.asyncDispose] () {
                            return _async_to_generator(function*() {})();
                        }
                    },
                    {
                        [Symbol.dispose] () {}
                    },
                    null,
                    undefined
                ]), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const d1 = _value;
                    try {
                        var _stack = [];
                        {}
                    } catch (_) {
                        var _error = _;
                        var _hasError = true;
                    } finally{
                        _dispose(_stack, _error, _hasError);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _iterator.return();
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
