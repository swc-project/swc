import * as swcHelpers from "@swc/helpers";
var map = new Map([
    [
        "",
        !0
    ],
    [
        "",
        0
    ]
]), _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = map[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
        var _value = swcHelpers.slicedToArray(_step.value, 2);
        _value[0], _value[1];
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
