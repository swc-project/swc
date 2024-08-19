//// [ES5For-ofTypeCheck10.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var StringIterator = /*#__PURE__*/ function() {
    function StringIterator() {
        _class_call_check(this, StringIterator);
    }
    var _proto = StringIterator.prototype;
    return _proto.next = function() {
        return {
            done: !0,
            value: ""
        };
    }, _proto[Symbol.iterator] = function() {
        return this;
    }, StringIterator;
}(), _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = (new StringIterator)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
