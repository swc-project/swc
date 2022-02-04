function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A() {
        var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, A), _field.set(this, {
            writable: !0,
            value: 0
        }), _classPrivateFieldSet(this, _field, 1), _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) + 2), _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) - 3), _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) / 4), _classPrivateFieldSet(this, _field, 5 * _classPrivateFieldGet(this, _field)), _classPrivateFieldSet(this, _field, Math.pow(_classPrivateFieldGet(this, _field), 6)), _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) % 7), _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) << 8), _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) >> 9), _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) >>> 10), _classPrivateFieldSet(this, _field, 11 & _classPrivateFieldGet(this, _field)), _classPrivateFieldSet(this, _field, 12 | _classPrivateFieldGet(this, _field)), _classPrivateFieldSet(this, _field, 13 ^ _classPrivateFieldGet(this, _field)), _classPrivateFieldSet(A.getInstance(), _field, 1), _classPrivateFieldSet(_ref = A.getInstance(), _field, _classPrivateFieldGet(_ref, _field) + 2), _classPrivateFieldSet(_ref1 = A.getInstance(), _field, _classPrivateFieldGet(_ref1, _field) - 3), _classPrivateFieldSet(_ref2 = A.getInstance(), _field, _classPrivateFieldGet(_ref2, _field) / 4), _classPrivateFieldSet(_ref3 = A.getInstance(), _field, 5 * _classPrivateFieldGet(_ref3, _field)), _classPrivateFieldSet(_ref4 = A.getInstance(), _field, Math.pow(_classPrivateFieldGet(_ref4, _field), 6)), _classPrivateFieldSet(_ref5 = A.getInstance(), _field, _classPrivateFieldGet(_ref5, _field) % 7), _classPrivateFieldSet(_ref6 = A.getInstance(), _field, _classPrivateFieldGet(_ref6, _field) << 8), _classPrivateFieldSet(_ref7 = A.getInstance(), _field, _classPrivateFieldGet(_ref7, _field) >> 9), _classPrivateFieldSet(_ref8 = A.getInstance(), _field, _classPrivateFieldGet(_ref8, _field) >>> 10), _classPrivateFieldSet(_ref9 = A.getInstance(), _field, 11 & _classPrivateFieldGet(_ref9, _field)), _classPrivateFieldSet(_ref10 = A.getInstance(), _field, 12 | _classPrivateFieldGet(_ref10, _field)), _classPrivateFieldSet(_ref11 = A.getInstance(), _field, 13 ^ _classPrivateFieldGet(_ref11, _field));
    }
    return Constructor = A, protoProps = null, staticProps = [
        {
            key: "getInstance",
            value: function() {
                return new A();
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}(), _field = new WeakMap();
