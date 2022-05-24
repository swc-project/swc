import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var _iterator = Symbol.iterator;
//@target: ES6
var NumberIterator = /*#__PURE__*/ function() {
    "use strict";
    function NumberIterator() {
        _class_call_check(this, NumberIterator);
    }
    var _proto = NumberIterator.prototype;
    _proto.next = function next() {
        return {
            value: 0,
            done: false
        };
    };
    _proto[_iterator] = function() {
        return this;
    };
    return NumberIterator;
}();
var v;
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator1 = (new NumberIterator)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator1.next()).done); _iteratorNormalCompletion = true){
        v = _step.value;
    } // Should succeed
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally{
    try {
        if (!_iteratorNormalCompletion && _iterator1.return != null) {
            _iterator1.return();
        }
    } finally{
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}
