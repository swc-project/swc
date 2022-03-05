import * as swcHelpers from "@swc/helpers";
var C1 = function() {
    "use strict";
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    return swcHelpers.createClass(C1, [
        {
            key: "bar",
            value: function() {}
        }
    ]), C1;
}(), C2 = function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    return swcHelpers.createClass(C2, null, [
        {
            key: "bar",
            value: function() {}
        }
    ]), C2;
}(), C3 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
};
C3.bar = "test";
