import * as swcHelpers from "@swc/helpers";
var _iterator = Symbol.iterator;
var StringIterator = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function StringIterator() {
        swcHelpers.classCallCheck(this, StringIterator);
    }
    swcHelpers.createClass(StringIterator, [
        {
            key: _iterator,
            value: function value() {
                return this;
            }
        }
    ]);
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
