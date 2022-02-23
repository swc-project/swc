function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
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
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
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
// @target: esnext
var Generic;
(function(Generic) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _classCallCheck(this, C);
        }
        _createClass(C, [
            {
                key: "y",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    var c = new C();
    c.y = c.y;
    var Box = /*#__PURE__*/ function() {
        "use strict";
        function Box() {
            _classCallCheck(this, Box);
            _classPrivateFieldInit(this, _value, {
                writable: true,
                value: void 0
            });
        }
        _createClass(Box, [
            {
                key: "value",
                get: function get() {
                    return _classPrivateFieldGet(this, _value);
                },
                set: function set(value) {
                    _classPrivateFieldSet(this, _value, value);
                }
            }
        ]);
        return Box;
    }();
    var _value = new WeakMap();
    new Box().value = 3;
})(Generic || (Generic = {}));
