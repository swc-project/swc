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
var _calcHello = new WeakSet(), _screamingHello = new WeakSet(), _screamingHello = new WeakSet();
// @target: esnext
// @allowJS: true
// @declaration: true
// @emitDeclarationOnly: true
// @filename: file.js
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        _hello.set(this, {
            writable: true,
            value: "hello"
        });
        _world.set(this, {
            writable: true,
            value: 100
        });
        _calcHello.add(this);
        _screamingHello.add(this);
        /** @param value {string} */ _screamingHello.add(this);
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
var _hello = new WeakMap();
var _world = new WeakMap();
function calcHello() {
    return _classPrivateFieldGet(this, _hello);
}
function screamingHello() {
    return _classPrivateFieldGet(this, _hello).toUpperCase();
}
function screamingHello(value) {
    throw "NO";
}
