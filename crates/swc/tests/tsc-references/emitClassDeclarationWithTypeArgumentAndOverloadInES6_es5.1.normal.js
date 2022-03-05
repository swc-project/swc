import * as swcHelpers from "@swc/helpers";
var B = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function B(a) {
        swcHelpers.classCallCheck(this, B);
        this.B = a;
    }
    swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function foo() {
                return this.x;
            }
        },
        {
            key: "BB",
            get: function get() {
                return this.B;
            }
        },
        {
            key: "BBWith",
            set: function set(c) {
                this.B = c;
            }
        }
    ]);
    return B;
}();
