import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, null, [
        {
            key: "bar",
            value: function bar() {
                // type of this is the constructor function type
                var t = this;
                return this;
            }
        }
    ]);
    return C;
}();
var t = C.bar();
// all ok
var r2 = t.foo + 1;
var r3 = t.bar();
var r4 = new t(1);
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2(x) {
        swcHelpers.classCallCheck(this, C2);
    }
    swcHelpers.createClass(C2, null, [
        {
            key: "bar",
            value: function bar() {
                // type of this is the constructor function type
                var t = this;
                return this;
            }
        }
    ]);
    return C2;
}();
var t2 = C2.bar();
// all ok
var r5 = t2.foo + 1;
var r6 = t2.bar();
var r7 = new t2('');
