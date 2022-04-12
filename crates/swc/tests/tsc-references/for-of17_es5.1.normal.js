import * as swcHelpers from "@swc/helpers";
var _$_iterator = Symbol.iterator;
//@target: ES6
var NumberIterator = /*#__PURE__*/ function() {
    "use strict";
    function NumberIterator() {
        swcHelpers.classCallCheck(this, NumberIterator);
    }
    var _proto = NumberIterator.prototype;
    _proto.next = function next() {
        return {
            value: 0,
            done: false
        };
    };
    _proto[_$_iterator] = function() {
        return this;
    };
    return NumberIterator;
}();
var v;
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = (new NumberIterator)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        v = _step.value;
    } // Should succeed
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
