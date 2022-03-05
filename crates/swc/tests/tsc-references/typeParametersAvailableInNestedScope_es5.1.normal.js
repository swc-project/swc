import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        this.x = function(a) {
            var y;
            return y;
        };
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo() {
                var temp = function temp(a) {
                    var y;
                    return y;
                };
                return temp(null);
            }
        }
    ]);
    return C;
}();
var c = new C();
c.data = c.x(null);
c.data = c.foo();
