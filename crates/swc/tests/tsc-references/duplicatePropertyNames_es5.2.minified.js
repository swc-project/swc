import * as swcHelpers from "@swc/helpers";
var _obj, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), this.baz = function() {}, this.baz = function() {};
    }
    return swcHelpers.createClass(C, [
        {
            key: "bar",
            value: function(x) {}
        }
    ]), C;
}();
_obj = {
    foo: ""
}, swcHelpers.defineProperty(_obj, "foo", ""), swcHelpers.defineProperty(_obj, "bar", function() {}), swcHelpers.defineProperty(_obj, "bar", function() {});
