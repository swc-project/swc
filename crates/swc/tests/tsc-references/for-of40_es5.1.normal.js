import * as swcHelpers from "@swc/helpers";
//@target: ES6
var map = new Map([
    [
        "",
        true
    ]
]);
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var _value = swcHelpers.slicedToArray(_step.value, 2), tmp = _value[0], k = tmp === void 0 ? "" : tmp, tmp1 = _value[1], v = tmp1 === void 0 ? false : tmp1;
        k;
        v;
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
