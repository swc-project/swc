import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
var a, b;
var tuple = [
    2,
    "3"
];
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = tuple[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var ref, ref1, ref2;
        ref = _sliced_to_array(_step.value, 2), ref1 = ref[0], a = ref1 === void 0 ? 1 : ref1, ref2 = ref[1], b = ref2 === void 0 ? "" : ref2, ref;
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
