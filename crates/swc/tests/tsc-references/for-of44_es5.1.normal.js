import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
//@target: ES6
var array = [
    [
        0,
        ""
    ],
    [
        0,
        true
    ],
    [
        1,
        Symbol()
    ]
];
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var _value = _sliced_to_array(_step.value, 2), num = _value[0], strBoolSym = _value[1];
        num;
        strBoolSym;
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
