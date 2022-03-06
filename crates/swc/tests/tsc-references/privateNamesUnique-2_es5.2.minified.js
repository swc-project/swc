function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = new WeakMap();
export var Foo = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Foo() {
        _classCallCheck(this, Foo), _classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
    return Constructor = Foo, protoProps = [
        {
            key: "copy",
            value: function(other) {
                var receiver, privateMap, descriptor, receiver, descriptor;
                (descriptor = (function(receiver, privateMap, action) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return privateMap.get(receiver);
                })(receiver = other, privateMap = _x, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Foo;
}();
var _x1 = new WeakMap();
export var Foo = function() {
    "use strict";
    _classCallCheck(this, Foo), _classPrivateFieldInit(this, _x1, {
        writable: !0,
        value: void 0
    });
};
var a = new A(), b = new B();
a.copy(b); // error
