import * as swcHelpers from "@swc/helpers";
// @target: es6
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
        this.x = 10;
        this.x = 10;
    }
    var _proto = B.prototype;
    _proto.foo = function foo() {
        B.log(this.x);
    };
    B.log = function log(a) {};
    swcHelpers.createClass(B, [
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
    ]);
    return B;
}();
