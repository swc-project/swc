import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), _bar = new WeakMap(), A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: !0,
        value: swcHelpers.classPrivateFieldGet(this, _bar)
    }), swcHelpers.classPrivateFieldInit(this, _bar, {
        writable: !0,
        value: swcHelpers.classPrivateFieldGet(this, _foo)
    }), this["#baz"] = this["#baz"];
};
