import * as swcHelpers from "@swc/helpers";
var Outer = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Outer);
};
Outer.Inner = (function() {
    "use strict";
    function I() {
        swcHelpers.classCallCheck(this, I);
    }
    return swcHelpers.createClass(I, [
        {
            key: "messages",
            value: function() {
                return [];
            }
        }
    ]), I;
})(), Outer.i, Outer.i.messages();
