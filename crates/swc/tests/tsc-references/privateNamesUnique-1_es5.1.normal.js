import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
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
var b = new B(); // Error: Property #foo is missing
