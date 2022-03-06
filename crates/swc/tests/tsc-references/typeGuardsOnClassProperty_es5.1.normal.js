import * as swcHelpers from "@swc/helpers";
var D = // Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// Note that the class's property must be copied to a local variable for
// the type guard to have an effect
/*#__PURE__*/ function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    swcHelpers.createClass(D, [
        {
            key: "getData",
            value: function getData() {
                var data = this.data;
                return typeof data === "string" ? data : data.join(" ");
            }
        },
        {
            key: "getData1",
            value: function getData1() {
                return typeof this.data === "string" ? this.data : this.data.join(" ");
            }
        }
    ]);
    return D;
}();
var o = {
    prop1: "string",
    prop2: true
};
if (typeof o.prop1 === "string" && o.prop1.toLowerCase()) {}
var prop1 = o.prop1;
if (typeof prop1 === "string" && prop1.toLocaleLowerCase()) {}
