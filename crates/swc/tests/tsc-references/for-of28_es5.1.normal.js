import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
//@target: ES6
var StringIterator = /*#__PURE__*/ function() {
    "use strict";
    function StringIterator() {
        _class_call_check(this, StringIterator);
    }
    var _proto = StringIterator.prototype;
    _proto[Symbol.iterator] = function() {
        return this;
    };
    return StringIterator;
}();
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = (new StringIterator)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var v = _step.value;
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
