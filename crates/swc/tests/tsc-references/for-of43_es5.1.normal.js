//@target: ES6
var array = [
    {
        x: "",
        y: 0
    }
];
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var _value = _step.value, tmp = _value.x, a = tmp === void 0 ? "" : tmp, tmp1 = _value.y, b = tmp1 === void 0 ? true : tmp1;
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
