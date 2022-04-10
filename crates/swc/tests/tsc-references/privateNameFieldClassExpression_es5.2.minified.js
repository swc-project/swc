import * as swcHelpers from "@swc/helpers";
var _class, _Foo, _foo = new WeakMap(), _foo2 = new WeakMap(), B = function() {
    swcHelpers.classCallCheck(this, B), swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: !0,
        value: ((_class = function _class1() {
            swcHelpers.classCallCheck(this, _class1), console.log("hello");
        }).test = 123, _class)
    }), swcHelpers.classPrivateFieldInit(this, _foo2, {
        writable: !0,
        value: ((_Foo = function Foo() {
            swcHelpers.classCallCheck(this, Foo);
        }).otherClass = 123, _Foo)
    });
};
