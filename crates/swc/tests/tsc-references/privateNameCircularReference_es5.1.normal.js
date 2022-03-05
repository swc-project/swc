import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), _bar = new WeakMap();
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: true,
        value: swcHelpers.classPrivateFieldGet(this, _bar)
    });
    swcHelpers.classPrivateFieldInit(this, _bar, {
        writable: true,
        value: swcHelpers.classPrivateFieldGet(this, _foo)
    });
    this["#baz"] = this["#baz"] // Error (should *not* be private name error)
    ;
};
