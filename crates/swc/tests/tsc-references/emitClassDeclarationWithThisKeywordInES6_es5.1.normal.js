import * as swcHelpers from "@swc/helpers";
var B = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
        this.x = 10;
        this.x = 10;
    }
    swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function foo() {
                B.log(this.x);
            }
        },
        {
            key: "X",
            get: function get() {
                return this.x;
            }
        },
        {
            key: "bX",
            set: function set(y) {
                this.x = y;
            }
        }
    ], [
        {
            key: "log",
            value: function log(a) {}
        }
    ]);
    return B;
}();
