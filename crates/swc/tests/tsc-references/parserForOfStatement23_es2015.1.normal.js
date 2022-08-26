// @target: esnext
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function foo(x) {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*(x) {
        var async;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(x), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    async = _value;
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
    return _foo.apply(this, arguments);
}
