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
// @target: es2015
var friendA;
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(v) {
        _classCallCheck(this, A);
        _x.set(this, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _x, v);
    }
    _createClass(A, [
        {
            key: "getX",
            value: function getX() {
                return _classPrivateFieldGet(this, _x);
            }
        }
    ]);
    return A;
}();
var _x = new WeakMap();
var __ = {
    writable: true,
    value: function() {
        friendA = {
            getX: function getX(obj) {
                return obj.#x;
            },
            setX: function setX(obj, value) {
                obj.#x = value;
            }
        };
    }()
};
var B = function B(a1) {
    "use strict";
    _classCallCheck(this, B);
    var x = friendA.getX(a1); // ok
    friendA.setX(a1, x + 1); // ok
};
var a = new A(41);
var b = new B(a);
a.getX();
