import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = [
        2,
        3
    ][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var _value = _sliced_to_array(_step.value, 2), tmp = _value[0], a = tmp === void 0 ? 0 : tmp, tmp1 = _value[1], b = tmp1 === void 0 ? 1 : tmp1;
        a;
        b;
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
