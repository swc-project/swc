import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = [
        {
            x: [
                0
            ],
            y: {
                p: ""
            }
        }
    ][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
        var _value = _step.value;
        _sliced_to_array(_value.x, 1)[0], _value.y.p;
    }
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
