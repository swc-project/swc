import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var array, _step, _iterator = array[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
        var _ref = _step.value;
        _ref.x, _object_without_properties(_ref, [
            "x"
        ]);
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
var _iteratorNormalCompletion1 = !0, _didIteratorError1 = !1, _iteratorError1 = void 0;
try {
    for(var __ref, _step1, _iterator1 = array[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = !0)__ref = _step1.value, _object_without_properties(__ref, [
        "x"
    ]), __ref.x;
} catch (err) {
    _didIteratorError1 = !0, _iteratorError1 = err;
} finally{
    try {
        _iteratorNormalCompletion1 || null == _iterator1.return || _iterator1.return();
    } finally{
        if (_didIteratorError1) throw _iteratorError1;
    }
}
var _iteratorNormalCompletion2 = !0, _didIteratorError2 = !1, _iteratorError2 = void 0;
try {
    for(var _step2, _iterator2 = array.map(function(a) {
        return _object_spread({}, a, {
            x: "a string"
        });
    })[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = !0){
        var norest = _step2.value;
        norest.x, norest.y;
    }
} catch (err) {
    _didIteratorError2 = !0, _iteratorError2 = err;
} finally{
    try {
        _iteratorNormalCompletion2 || null == _iterator2.return || _iterator2.return();
    } finally{
        if (_didIteratorError2) throw _iteratorError2;
    }
}
