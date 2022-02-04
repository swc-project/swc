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
var Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo), _p1.set(this, {
            writable: !0,
            value: function(v) {
                if ("string" != typeof v) throw new Error();
            }
        });
    }
    return _createClass(Foo, [
        {
            key: "m1",
            value: function(v) {
                (function(receiver, privateMap) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return privateMap.get(receiver).value;
                })(this, _p1).call(this, v);
            }
        }
    ]), Foo;
}(), _p1 = new WeakMap(), _p11 = new WeakSet(), Foo2 = function() {
    "use strict";
    function Foo2() {
        _classCallCheck(this, Foo2), _p11.add(this);
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
