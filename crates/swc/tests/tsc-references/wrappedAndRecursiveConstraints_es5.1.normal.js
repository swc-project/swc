import * as swcHelpers from "@swc/helpers";
var C = // no errors expected
/*#__PURE__*/ function() {
    "use strict";
    function C(data) {
        swcHelpers.classCallCheck(this, C);
        this.data = data;
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo(x) {
                return x;
            }
        }
    ]);
    return C;
}();
var y = null;
var c = new C(y);
var r = c.foo(y);
