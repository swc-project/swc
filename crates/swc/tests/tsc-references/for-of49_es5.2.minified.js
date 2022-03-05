import * as swcHelpers from "@swc/helpers";
var map = new Map([
    [
        "",
        !0
    ]
]), _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var ref, _step, _iterator = map[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)(ref = swcHelpers.toArray(_step.value))[0], swcHelpers.slicedToArray(ref.slice(1), 1)[0];
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
