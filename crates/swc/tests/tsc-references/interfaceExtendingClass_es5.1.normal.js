import * as swcHelpers from "@swc/helpers";
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    swcHelpers.createClass(Foo, [
        {
            key: "y",
            value: function y() {}
        },
        {
            key: "Z",
            get: function get() {
                return 1;
            }
        }
    ]);
    return Foo;
}();
var i;
var r1 = i.x;
var r2 = i.y();
var r3 = i.Z;
var f = i;
i = f;
