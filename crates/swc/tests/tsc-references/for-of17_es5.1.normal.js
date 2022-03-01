function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var _iterator = Symbol.iterator;
var NumberIterator = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function NumberIterator() {
        _classCallCheck(this, NumberIterator);
    }
    _createClass(NumberIterator, [
        {
            key: "next",
            value: function next() {
                return {
                    value: 0,
                    done: false
                };
            }
        },
        {
            key: _iterator,
            value: function value() {
                return this;
            }
        }
    ]);
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
