import * as swcHelpers from "@swc/helpers";
//@target: ES6
var k, v;
var map = new Map([
    [
        "",
        true
    ]
]);
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var ref, ref1;
        ref = swcHelpers.toArray(_step.value), k = ref[0], ref1 = swcHelpers.slicedToArray(ref.slice(1), 1), v = ref1[0], ref1, ref;
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
