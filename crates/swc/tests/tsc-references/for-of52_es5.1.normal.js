import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    //@target: ES6
    for(var _iterator = [
        []
    ][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var _value = _sliced_to_array(_step.value, 2), v = _value[0], v = _value[1];
    }
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
