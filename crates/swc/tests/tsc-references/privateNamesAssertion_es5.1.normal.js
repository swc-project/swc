import * as swcHelpers from "@swc/helpers";
var _p1 = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: esnext, es2022
// @useDefineForClassFields: false
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
        swcHelpers.classPrivateFieldInit(this, _p1, {
            writable: true,
            value: function(v) {
                if (typeof v !== "string") {
                    throw new Error();
                }
            }
        });
    }
    var _proto = Foo.prototype;
    _proto.m1 = function m1(v) {
        swcHelpers.classPrivateFieldGet(this, _p1).call(this, v);
        v;
    };
    return Foo;
}();
var _p11 = /*#__PURE__*/ new WeakSet();
var Foo2 = /*#__PURE__*/ function() {
    "use strict";
    function Foo2() {
        swcHelpers.classCallCheck(this, Foo2);
        swcHelpers.classPrivateMethodInit(this, _p11);
    }
    var _proto = Foo2.prototype;
    _proto.m1 = function m1(v) {
        swcHelpers.classPrivateMethodGet(this, _p11, p1).call(this, v);
        v;
    };
    return Foo2;
}();
function p1(v) {
    if (typeof v !== "string") {
        throw new Error();
    }
}
