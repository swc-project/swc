import * as swcHelpers from "@swc/helpers";
//@target: es5
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
var num;
var strOrNum;
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    swcHelpers.createClass(C1, [
        {
            key: "pp3",
            get: // Inside public accessor getter
            function get() {
                return strOrNum;
            }
        },
        {
            key: "method",
            value: function method() {
                strOrNum = typeof this.pp1 === "string" && this.pp1; // string | number
                strOrNum = typeof this.pp2 === "string" && this.pp2; // string | number
                strOrNum = typeof this.pp3 === "string" && this.pp3; // string | number
            }
        }
    ]);
    return C1;
}();
var c1;
strOrNum = typeof c1.pp2 === "string" && c1.pp2; // string | number
strOrNum = typeof c1.pp3 === "string" && c1.pp3; // string | number
var obj1;
strOrNum = typeof obj1.x === "string" && obj1.x; // string | number
