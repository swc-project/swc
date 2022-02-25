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
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
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
var _foo = new WeakMap(), _bar = new WeakMap();
var A = // @declaration: true
// @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _bar, {
            writable: true,
            value: 6
        });
        this.qux = 6;
    }
    _createClass(A, [
        {
            key: "quux",
            value: function quux() {}
        }
    ]);
    return A;
}();
