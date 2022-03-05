import * as swcHelpers from "@swc/helpers";
var _p1 = new WeakMap();
var Foo = // @strict: true
// @target: esnext, es2022
// @useDefineForClassFields: false
/*#__PURE__*/ function() {
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
    swcHelpers.createClass(Foo, [
        {
            key: "m1",
            value: function m1(v) {
                swcHelpers.classPrivateFieldGet(this, _p1).call(this, v);
                v;
            }
        }
    ]);
    return Foo;
}();
var _p11 = new WeakSet();
var Foo2 = /*#__PURE__*/ function() {
    "use strict";
    function Foo2() {
        swcHelpers.classCallCheck(this, Foo2);
        swcHelpers.classPrivateMethodInit(this, _p11);
    }
    swcHelpers.createClass(Foo2, [
        {
            key: "m1",
            value: function m1(v) {
                swcHelpers.classPrivateMethodGet(this, _p11, p1).call(this, v);
                v;
            }
        }
    ]);
    return Foo2;
}();
function p1(v) {
    if (typeof v !== "string") {
        throw new Error();
    }
}
