import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B), this.x = 10, this.x = 10;
    }
    return B.prototype.foo = function() {
        B.log(this.x);
    }, B.log = function(a) {}, swcHelpers.createClass(B, [
        {
            key: "X",
            get: function() {
                return this.x;
            }
        },
        {
            key: "bX",
            set: function(y) {
                this.x = y;
            }
        }
    ]), B;
}();
