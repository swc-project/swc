import * as swcHelpers from "@swc/helpers";
var _class, _Foo;
var _foo = new WeakMap(), _foo2 = new WeakMap();
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
    swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: true,
        value: (_class = function _class1() {
            swcHelpers.classCallCheck(this, _class1);
            console.log("hello");
        }, _class.test = 123, _class)
    });
    swcHelpers.classPrivateFieldInit(this, _foo2, {
        writable: true,
        value: (_Foo = function Foo() {
            swcHelpers.classCallCheck(this, Foo);
        }, _Foo.otherClass = 123, _Foo)
    });
};
