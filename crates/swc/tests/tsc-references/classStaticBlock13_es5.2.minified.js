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
                return swcHelpers.classStaticPrivateFieldSpecGet(C, C, _x);
            }
        }
    ]), C;
}(), _x = {
    writable: !0,
    value: 123
};
console.log(swcHelpers.classStaticPrivateFieldSpecGet(C, C, _x));
