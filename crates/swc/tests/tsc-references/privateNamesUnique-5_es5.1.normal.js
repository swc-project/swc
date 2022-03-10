import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
// @strict: true
// @target: es6
// @strictPropertyInitialization: false
// same as privateNamesUnique-1, but with an interface
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: true,
        value: void 0
    });
};
var _foo1 = new WeakMap();
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
    swcHelpers.classPrivateFieldInit(this, _foo1, {
        writable: true,
        value: void 0
    });
};
var b = new B();
