import * as swcHelpers from "@swc/helpers";
var _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), _e = new WeakMap(), A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _a, {
            writable: !0,
            value: "a"
        }), swcHelpers.classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldInit(this, _c, {
            writable: !0,
            value: "c"
        }), swcHelpers.classPrivateFieldInit(this, _d, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldInit(this, _e, {
            writable: !0,
            value: ""
        }), swcHelpers.classPrivateFieldSet(this, _b, "b"), swcHelpers.classPrivateFieldSet(this, _d, "d");
    }
    return A.prototype.test = function() {
        var data = {
            a: "a",
            b: "b",
            c: "c",
            d: "d",
            e: "e"
        }, a = data[swcHelpers.classPrivateFieldGet(this, _a)], b = data[swcHelpers.classPrivateFieldGet(this, _b)], c = data[swcHelpers.classPrivateFieldGet(this, _c)], d = data[swcHelpers.classPrivateFieldGet(this, _d)], e = data[swcHelpers.classPrivateFieldSet(this, _e, "e")];
        console.log(a, b, c, d, e);
        var a1 = data[swcHelpers.classPrivateFieldGet(this, _a)], b1 = data[swcHelpers.classPrivateFieldGet(this, _b)], c1 = data[swcHelpers.classPrivateFieldGet(this, _c)], d1 = data[swcHelpers.classPrivateFieldGet(this, _d)];
        data[swcHelpers.classPrivateFieldGet(this, _e)], console.log(a1, b1, c1, d1);
    }, A;
}();
new A().test();
