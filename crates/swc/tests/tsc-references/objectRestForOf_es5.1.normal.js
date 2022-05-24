import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
// @target: es2015
var array;
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var _ref = _step.value;
        var x = _ref.x, restOf = _object_without_properties(_ref, [
            "x"
        ]);
        [
            x,
            restOf
        ];
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
var xx;
var rrestOff;
var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
try {
    for(var _iterator1 = array[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
        var _ref1 = _step1.value;
        var __ref;
        var ref;
        __ref = _ref1, rrestOff = _object_without_properties(__ref, [
            "x"
        ]), ref = __ref, xx = ref.x, ref, __ref;
        [
            xx,
            rrestOff
        ];
    }
} catch (err) {
    _didIteratorError1 = true;
    _iteratorError1 = err;
} finally{
    try {
        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
            _iterator1.return();
        }
    } finally{
        if (_didIteratorError1) {
            throw _iteratorError1;
        }
    }
}
var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
try {
    for(var _iterator2 = array.map(function(a) {
        return _object_spread({}, a, {
            x: "a string"
        });
    })[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
        var norest = _step2.value;
        [
            norest.x,
            norest.y
        ];
    // x is now a string. who knows why.
    }
} catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
} finally{
    try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
        }
    } finally{
        if (_didIteratorError2) {
            throw _iteratorError2;
        }
    }
}
