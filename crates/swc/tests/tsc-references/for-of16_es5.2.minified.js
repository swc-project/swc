function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _iterator = Symbol.iterator, StringIterator = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function StringIterator() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, StringIterator);
    }
    return Constructor = StringIterator, protoProps = [
        {
            key: _iterator,
            value: function() {
                return this;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), StringIterator;
}(), _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator1 = (new StringIterator)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator1.next()).done); _iteratorNormalCompletion = !0)_step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator1.return || _iterator1.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
