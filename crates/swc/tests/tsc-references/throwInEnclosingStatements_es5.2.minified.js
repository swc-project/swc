import * as swcHelpers from "@swc/helpers";
switch(y){
    case "a":
        throw y;
    default:
        throw y;
}
for(;;)throw 0;
for(;;)throw 0;
for(var idx in {})throw idx;
for(;;)throw null;
var y, C = function() {
    "use strict";
    function C() {
        throw swcHelpers.classCallCheck(this, C), this;
    }
    return swcHelpers.createClass(C, [
        {
            key: "biz",
            value: function() {
                throw this.value;
            }
        }
    ]), C;
}();
