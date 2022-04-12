import * as swcHelpers from "@swc/helpers";
var _$_iterator = Symbol.iterator, StringIterator = function() {
    "use strict";
    function StringIterator() {
        swcHelpers.classCallCheck(this, StringIterator);
    }
    return StringIterator.prototype[_$_iterator] = function() {
        return v;
    }, StringIterator;
}(), _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = (new StringIterator)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)var v = _step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
