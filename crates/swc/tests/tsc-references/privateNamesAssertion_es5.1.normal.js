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
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
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
var _p1 = new WeakMap();
var Foo = // @strict: true
// @target: esnext, es2022
// @useDefineForClassFields: false
/*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _classPrivateFieldInit(this, _p1, {
            writable: true,
            value: function(v) {
                if (typeof v !== "string") {
                    throw new Error();
                }
            }
        });
    }
    _createClass(Foo, [
        {
            key: "m1",
            value: function m1(v) {
                _classPrivateFieldGet(this, _p1).call(this, v);
                v;
            }
        }
    ]);
    return Foo;
}();
var _p11 = new WeakSet();
var Foo2 = /*#__PURE__*/ function() {
    "use strict";
    function Foo2() {
        _classCallCheck(this, Foo2);
        _classPrivateMethodInit(this, _p11);
    }
    _createClass(Foo2, [
        {
            key: "m1",
            value: function m1(v) {
                _classPrivateMethodGet(this, _p11, p1).call(this, v);
                v;
            }
        }
    ]);
    return Foo2;
}();
function p1(v) {
    if (typeof v !== "string") {
        throw new Error();
    }
}
