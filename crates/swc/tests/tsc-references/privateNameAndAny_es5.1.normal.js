function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
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
var A = // @strict: true
// @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
        _foo.set(this, {
            writable: true,
            value: true
        });
    }
    _createClass(A, [
        {
            key: "method",
            value: function method(thing) {
                _classPrivateFieldGet(thing, _foo); // OK
                _classPrivateFieldGet(thing, _bar); // Error
            }
        }
    ]);
    return A;
}();
var _foo = new WeakMap();
