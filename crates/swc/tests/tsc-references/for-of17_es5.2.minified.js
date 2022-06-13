import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var NumberIterator = function() {
    "use strict";
    function NumberIterator() {
        _class_call_check(this, NumberIterator);
    }
    var _proto = NumberIterator.prototype;
    return _proto.next = function() {
        return {
            value: 0,
            done: !1
        };
    }, _proto[Symbol.iterator] = function() {
        return this;
    }, NumberIterator;
}(), _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = (new NumberIterator)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
