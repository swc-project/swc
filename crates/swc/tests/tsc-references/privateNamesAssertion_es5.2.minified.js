function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var _p1 = new WeakMap(), Foo = function() {
    "use strict";
    function Foo() {
        var obj, privateMap, value;
        _classCallCheck(this, Foo), obj = this, privateMap = _p1, value = {
            writable: !0,
            value: function(v) {
                if ("string" != typeof v) throw new Error();
            }
        }, _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
    }
    return _createClass(Foo, [
        {
            key: "m1",
            value: function(v) {
                var receiver, privateMap, descriptor, receiver, descriptor;
                (receiver = this, (descriptor = (function(receiver, privateMap, action) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return privateMap.get(receiver);
                })(receiver, privateMap = _p1, "get")).get ? descriptor.get.call(receiver) : descriptor.value).call(this, v);
            }
        }
    ]), Foo;
}(), _p11 = new WeakSet(), Foo2 = function() {
    "use strict";
    function Foo2() {
        var obj, privateSet;
        _classCallCheck(this, Foo2), obj = this, _checkPrivateRedeclaration(obj, privateSet = _p11), privateSet.add(obj);
    }
    return _createClass(Foo2, [
        {
            key: "m1",
            value: function(v) {
                (function(receiver, privateSet, fn) {
                    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return fn;
                })(this, _p11, p1).call(this, v);
            }
        }
    ]), Foo2;
}();
function p1(v) {
    if ("string" != typeof v) throw new Error();
}
