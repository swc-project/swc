import * as swcHelpers from "@swc/helpers";
//@target: ES6
var array = [
    {
        x: [
            0
        ],
        y: {
            p: ""
        }
    }
];
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var _value = _step.value, _x = swcHelpers.slicedToArray(_value.x, 1), a = _x[0], p = _value.y.p;
        a;
        p;
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
