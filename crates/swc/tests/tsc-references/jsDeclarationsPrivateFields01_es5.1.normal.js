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
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
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
var _hello = new WeakMap(), _world = new WeakMap(), _calcHello = new WeakSet(), _screamingHello = new WeakMap();
// @target: esnext
// @allowJS: true
// @declaration: true
// @emitDeclarationOnly: true
// @filename: file.js
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        _classPrivateFieldInit(this, _hello, {
            writable: true,
            value: "hello"
        });
        _classPrivateFieldInit(this, _world, {
            writable: true,
            value: 100
        });
        _classPrivateMethodInit(this, _calcHello);
        _classPrivateFieldInit(this, _screamingHello, {
            get: get_screamingHello,
            set: /** @param value {string} */ set_screamingHello
        });
    }
    _createClass(C, [
        {
            key: "getWorld",
            value: function getWorld() {
                return _classPrivateFieldGet(this, _world);
            }
        }
    ]);
    return C;
}();
function calcHello() {
    return _classPrivateFieldGet(this, _hello);
}
function get_screamingHello() {
    return _classPrivateFieldGet(this, _hello).toUpperCase();
}
function set_screamingHello(value) {
    throw "NO";
}
