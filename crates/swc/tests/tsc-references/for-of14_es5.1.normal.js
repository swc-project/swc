import * as swcHelpers from "@swc/helpers";
var StringIterator = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function StringIterator() {
        swcHelpers.classCallCheck(this, StringIterator);
    }
    swcHelpers.createClass(StringIterator, [
        {
            key: "next",
            value: function next() {
                return "";
            }
        }
    ]);
    return StringIterator;
}();
var v;
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = (new StringIterator)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        v = _step.value;
    } // Should fail because the iterator is not iterable
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
