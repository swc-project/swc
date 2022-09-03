//// [ES5For-of30.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var tuple = [
    2,
    "3"
], _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var a, b, ref, ref1, ref2, _step, _iterator = tuple[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)ref1 = (ref = _sliced_to_array(_step.value, 2))[0], ref2 = ref[1];
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
