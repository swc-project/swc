import * as swcHelpers from "@swc/helpers";
var i, Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "y",
            value: function() {}
        },
        {
            key: "Z",
            get: function() {
                return 1;
            }
        }
    ]), Foo;
}();
i.x, i.y(), i.Z;
