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
var _key;
var tmp = (_key = Symbol.iterator, Symbol.toPrimitive), _toStringTag = Symbol.toStringTag;
var C = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        this[_key] = 0;
    }
    _createClass(C, [
        {
            key: tmp,
            value: function value() {}
        },
        {
            key: _toStringTag,
            get: function get() {
                return 0;
            }
        }
    ]);
    return C;
}();
