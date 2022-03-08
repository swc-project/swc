import * as swcHelpers from "@swc/helpers";
var _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), _e = new WeakMap();
// @target: esnext, es2022, es2015
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
        swcHelpers.classPrivateFieldInit(this, _a, {
            writable: true,
            value: 'a'
        });
        swcHelpers.classPrivateFieldInit(this, _b, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _c, {
            writable: true,
            value: 'c'
        });
        swcHelpers.classPrivateFieldInit(this, _d, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _e, {
            writable: true,
            value: ''
        });
        swcHelpers.classPrivateFieldSet(this, _b, 'b');
        swcHelpers.classPrivateFieldSet(this, _d, 'd');
    }
    var _proto = A.prototype;
    _proto.test = function test() {
        var data = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e'
        };
        var a = data[swcHelpers.classPrivateFieldGet(this, _a)], b = data[swcHelpers.classPrivateFieldGet(this, _b)], c = data[swcHelpers.classPrivateFieldGet(this, _c)], d = data[swcHelpers.classPrivateFieldGet(this, _d)], e = data[swcHelpers.classPrivateFieldSet(this, _e, 'e')];
        console.log(a, b, c, d, e);
        var a1 = data[swcHelpers.classPrivateFieldGet(this, _a)];
        var b1 = data[swcHelpers.classPrivateFieldGet(this, _b)];
        var c1 = data[swcHelpers.classPrivateFieldGet(this, _c)];
        var d1 = data[swcHelpers.classPrivateFieldGet(this, _d)];
        var e1 = data[swcHelpers.classPrivateFieldGet(this, _e)];
        console.log(a1, b1, c1, d1);
    };
    return A;
}();
new A().test();
