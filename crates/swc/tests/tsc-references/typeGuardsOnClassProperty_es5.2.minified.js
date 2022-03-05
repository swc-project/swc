import * as swcHelpers from "@swc/helpers";
var D = function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return swcHelpers.createClass(D, [
        {
            key: "getData",
            value: function() {
                var data = this.data;
                return "string" == typeof data ? data : data.join(" ");
            }
        },
        {
            key: "getData1",
            value: function() {
                return "string" == typeof this.data ? this.data : this.data.join(" ");
            }
        }
    ]), D;
}(), o = {
    prop1: "string",
    prop2: !0
};
"string" == typeof o.prop1 && o.prop1.toLowerCase();
var prop1 = o.prop1;
"string" == typeof prop1 && prop1.toLocaleLowerCase();
