import { Foo as A } from "./a";
import { Foo as B } from "./b";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export var Foo = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Foo() {
        _classCallCheck(this, Foo), _x.set(this, {
            writable: !0,
            value: void 0
        });
    }
    return Constructor = Foo, protoProps = [
        {
            key: "copy",
            value: function(other) {
                !function(receiver, privateMap) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return privateMap.get(receiver).value;
                }(other, _x);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Foo;
}();
var _x = new WeakMap();
export var Foo = function() {
    "use strict";
    _classCallCheck(this, Foo), _x1.set(this, {
        writable: !0,
        value: void 0
    });
};
var _x1 = new WeakMap(), a = new A(), b = new B();
a.copy(b); // error
