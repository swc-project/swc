function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
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
var A = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
        var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11;
        _classPrivateFieldInit(this, _field, {
            writable: true,
            value: 0
        });
        _classPrivateFieldSet(this, _field, 1);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) + 2);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) - 3);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) / 4);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) * 5);
        _classPrivateFieldSet(this, _field, Math.pow(_classPrivateFieldGet(this, _field), 6));
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) % 7);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) << 8);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) >> 9);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) >>> 10);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) & 11);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) | 12);
        _classPrivateFieldSet(this, _field, _classPrivateFieldGet(this, _field) ^ 13);
        _classPrivateFieldSet(A.getInstance(), _field, 1);
        _classPrivateFieldSet(_ref = A.getInstance(), _field, _classPrivateFieldGet(_ref, _field) + 2);
        _classPrivateFieldSet(_ref1 = A.getInstance(), _field, _classPrivateFieldGet(_ref1, _field) - 3);
        _classPrivateFieldSet(_ref2 = A.getInstance(), _field, _classPrivateFieldGet(_ref2, _field) / 4);
        _classPrivateFieldSet(_ref3 = A.getInstance(), _field, _classPrivateFieldGet(_ref3, _field) * 5);
        _classPrivateFieldSet(_ref4 = A.getInstance(), _field, Math.pow(_classPrivateFieldGet(_ref4, _field), 6));
        _classPrivateFieldSet(_ref5 = A.getInstance(), _field, _classPrivateFieldGet(_ref5, _field) % 7);
        _classPrivateFieldSet(_ref6 = A.getInstance(), _field, _classPrivateFieldGet(_ref6, _field) << 8);
        _classPrivateFieldSet(_ref7 = A.getInstance(), _field, _classPrivateFieldGet(_ref7, _field) >> 9);
        _classPrivateFieldSet(_ref8 = A.getInstance(), _field, _classPrivateFieldGet(_ref8, _field) >>> 10);
        _classPrivateFieldSet(_ref9 = A.getInstance(), _field, _classPrivateFieldGet(_ref9, _field) & 11);
        _classPrivateFieldSet(_ref10 = A.getInstance(), _field, _classPrivateFieldGet(_ref10, _field) | 12);
        _classPrivateFieldSet(_ref11 = A.getInstance(), _field, _classPrivateFieldGet(_ref11, _field) ^ 13);
    }
    _createClass(A, null, [
        {
            key: "getInstance",
            value: function getInstance() {
                return new A();
            }
        }
    ]);
    return A;
}();
var _field = new WeakMap();
