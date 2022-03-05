import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, null, [
        {
            key: "foo",
            value: function() {
                C.foo = function() {};
            }
        },
        {
            key: "bar",
            value: function(x1) {
                return C.bar = function() {}, C.bar = function(x) {
                    return x;
                }, C.bar = function(x) {
                    return 1;
                }, 1;
            }
        }
    ]), C;
}();
