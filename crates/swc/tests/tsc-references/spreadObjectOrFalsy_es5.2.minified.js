import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "bar",
            value: function() {
                this.hasData() && this.data.toLocaleLowerCase();
            }
        },
        {
            key: "hasData",
            value: function() {
                return !0;
            }
        }
    ]), Foo;
}();
