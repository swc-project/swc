import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "banana",
            value: function(x) {}
        }
    ]), Foo;
}();
