import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {
                C.prototype.foo = function() {};
            }
        },
        {
            key: "bar",
            value: function(x1) {
                return C.prototype.bar = function() {}, C.prototype.bar = function(x) {
                    return x;
                }, C.prototype.bar = function(x) {
                    return 1;
                }, 1;
            }
        }
    ]), C;
}();
