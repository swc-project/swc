import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var _iterator = Symbol.iterator;
//@target: ES6
var StringIterator = /*#__PURE__*/ function() {
    "use strict";
    function StringIterator() {
        _class_call_check(this, StringIterator);
    }
    var _proto = StringIterator.prototype;
    _proto.next = function next() {
        return {
            // no done property
            value: ""
        };
    };
    _proto[_iterator] = function() {
        return this;
    };
    return StringIterator;
}();
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator1 = (new StringIterator)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator1.next()).done); _iteratorNormalCompletion = true){
        var v = _step.value;
    }
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
