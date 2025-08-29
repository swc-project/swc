import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
(function() {
    return _async_to_generator(function() {
        var array, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;
        return _ts_generator(this, function(_state) {
            array = [
                1,
                2,
                3
            ];
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                _loop = function() {
                    var el = _step.value;
                    setTimeout(function() {
                        console.log(el);
                    }, 1);
                };
                for(_iterator = array[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            return [
                2
            ];
        });
    })();
})();
